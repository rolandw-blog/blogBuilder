import marked from "marked";
import ITemplateData from "../../interfaces/template.interface";
import fs from "fs";
import path from "path";
import genericLogger from "../../utils/genericLogger";
const logger = genericLogger(__filename);
// eslint-disable-next-line node/no-unpublished-import
import ejs from "ejs";
import markedOverwrites from "./markedOverwrites";
import { ISource } from "../../interfaces/page.interface";
import axios, { AxiosRequestConfig } from "axios";
import { minify } from "html-minifier";
import { JSDOM } from "jsdom";
import safeSyncRead from "../../utils/safeSyncRead";
import { OUTPUT_DIR } from "../../constants";

marked.setOptions({
	renderer: markedOverwrites(),
});

const postProcessingSteps = [
	// remove the article H1 tag
	(html: string) => {
		// ! I dont like this at the moment but will enable later
		return html;
		// // parse the dom
		// const dom = new JSDOM(html);

		// // get the first h1
		// const h1 = dom.window.document.querySelector("article h1");
		// if (h1) {
		// 	// to change the title use this
		// 	// h1.textContent = "hello world";

		// 	// to remove the text use this
		// 	h1.remove();
		// }

		// // return the html as a strin
		// return dom.serialize();
	},
	// convert all headings to caps first titles
	(html: string) => {
		// parse the dom
		const dom = new JSDOM(html);

		for (const h of dom.window.document.querySelectorAll(
			"article h1, article h2, article h3, article h4, article h5, article h6"
		)) {
			if (h.textContent) {
				let sentence = "";
				// iterate over each word and caps where required
				for (const w of h.textContent.split(" ")) {
					// if the word is long enough it should be capitalised
					if (w.length > 3) {
						const wordStripped = w.replace(/\t|\n/g, "");
						const firstLetter = wordStripped.charAt(0).toUpperCase();
						const restOfWord = wordStripped.substring(1);
						sentence += `${firstLetter}${restOfWord} `;
					}
				}

				// set the new text
				h.textContent = sentence;
			}
		}

		// return the html as a string
		return dom.serialize();
	},
	// minify the html
	(html: string) => {
		return minify(html, {
			collapseWhitespace: true,
			removeComments: true,
			trimCustomFragments: true,
			minifyCSS: true,
			useShortDoctype: true,
			minifyURLs: true,
		});
	},
];

// memoize the template read to avoid reading it multiple times
function readTemplateFile(): (templateFile: string) => string {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const cache: any = {};
	return (templateFile: string) => {
		if (cache[templateFile]) {
			logger.debug(`TemplateFile read hit cache for ${templateFile}`);
			return cache[templateFile];
		}
		const template = safeSyncRead(templateFile);
		cache[templateFile] = template;
		// check the cache size is not too big
		if (Object.keys(cache).length > 50) {
			logger.debug(`TemplateFile cache is too big, clearing cache`);
			Object.keys(cache).forEach((key) => {
				delete cache[key];
			});
		}
		return template;
	};
}

// memoize the page download to avoid downloading it multiple times
function getPage(): (url: string) => Promise<string> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const cache: any = {};
	return async (url: string) => {
		if (cache[url]) {
			logger.debug(`getPage read hit cache for ${url}`);
			return cache[url];
		}
		try {
			const options: AxiosRequestConfig = {};
			const response = await axios(url, options);
			const data = await response.data;
			cache[url] = data;
			// check the cache size is not too big
			if (Object.keys(cache).length > 50) {
				logger.debug(`getPage cache is too big, clearing cache`);
				Object.keys(cache).forEach((key) => {
					delete cache[key];
				});
			}
			return data as string;
		} catch (err) {
			return err;
		}
	};
}

// for the post processing
type postProcessConstructor = {
	(html: string): string;
};

class Renderer {
	private readTemplateFile: (templateFile: string) => string;
	private getPage: (url: string) => Promise<string>;
	public outDir = OUTPUT_DIR || "/html/dist";

	constructor() {
		this.readTemplateFile = readTemplateFile();
		this.getPage = getPage();
	}

	// run through the post processing steps, try each step, if a step fails, try the next one etc
	// this is recursive and will run until all steps are complete
	private postProcess(html: string, steps: postProcessConstructor[], index: number): string {
		if (index < steps.length && steps.length >= 0) {
			try {
				// create the step with a fallback in case the step given is undefined for some reason
				const step = steps[index] || ((html) => html);

				// process the html through that step, then return the result and set that to the html
				// then call the next step passing the processed html
				const newHtml = step(html);
				return this.postProcess(newHtml, steps, index + 1);
			} catch (err) {
				// if the post step fails, log the error and continue to the next step
				logger.error(`Failed to post process ${err}`);
				return this.postProcess(html, steps, index + 1);
			}
		} else {
			return html;
		}
	}

	public async render(templateData: ITemplateData): Promise<string> {
		const templateFilePath = path.resolve(templateData.templateDir, templateData.meta.template);
		const template = this.readTemplateFile(templateFilePath);
		const unminifiedHtml = ejs.render(
			template,
			{
				...templateData,
				content: await this.renderMarkdown(templateData.source),
			},
			{ rmWhitespace: true }
		);

		// return the html after attempting to do some post processing on the DOM
		return this.postProcess(unminifiedHtml, [...postProcessingSteps], 0);
	}

	// write the rendered html to disk
	public async writeToDisk(template: ITemplateData, html: string): Promise<void> {
		// if the name is "index" then the output is "/data/dist/index.html"
		// if the name is not "index" then the output is joined based on its path
		const pathString = template.name === "index" ? this.outDir : template.path.join("/");

		// /data/dist + /foo + /bar + index.html
		const outputFilePath = path.resolve(
			this.outDir,
			pathString,
			path.parse(pathString).ext,
			`index.html`
		);

		if (!fs.existsSync(path.parse(outputFilePath).dir)) {
			await fs.promises.mkdir(path.parse(outputFilePath).dir, { recursive: true });
			logger.debug(`Created folder ${path.parse(outputFilePath).dir}`);
		} else {
			logger.debug(`Folder ${path.parse(outputFilePath).dir} already exists`);
		}

		fs.promises.writeFile(outputFilePath, html).then(() => {
			logger.info(`${outputFilePath} written`);
		});
	}

	private async renderMarkdown(markdownSources: ISource[]): Promise<string> {
		// collect all the markdown files
		const markdown = [];
		for (const source of markdownSources) {
			const page = this.getPage(source.url);
			markdown.push(await page);
		}

		// parse them into html with marked
		const html = marked(markdown.join("\n"));

		// send them back for the renderer to use
		return html;
	}
}

export default Renderer;
