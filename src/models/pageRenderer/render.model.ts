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

marked.setOptions({
	renderer: markedOverwrites(),
});

// memoize the template read to avoid reading it multiple times
function readTemplateFile(): (templateFile: string) => string {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const cache: any = {};
	return (templateFile: string) => {
		if (cache[templateFile]) {
			logger.debug(`TemplateFile read hit cache for ${templateFile}`);
			return cache[templateFile];
		}
		const template = fs.readFileSync(templateFile, "utf8");
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

class Renderer {
	private readTemplateFile: (templateFile: string) => string;
	private getPage: (url: string) => Promise<string>;
	public outDir = process["env"]["OUTPUT"] || "/html/dist";

	constructor() {
		this.readTemplateFile = readTemplateFile();
		this.getPage = getPage();
	}

	public async render(templateData: ITemplateData): Promise<string> {
		const templateFilePath = path.resolve(templateData.templateDir, templateData.meta.template);
		const template = this.readTemplateFile(templateFilePath);
		const html = ejs.render(
			template,
			{
				...templateData,
				content: await this.renderMarkdown(templateData.source),
			},
			{ rmWhitespace: true }
		);
		return html;
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
