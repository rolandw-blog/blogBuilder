const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const path = require("path");
const ejs = require("ejs");
const { promisify } = require("util");
const marked = require("marked");
const createRenderer = require("./buildSteps/createRenderer");
const downloadMarkdown = require("./buildSteps/downloadMarkdown");
const { minify } = require("html-minifier");
const { throws } = require("assert");

class PageRenderer {
	constructor(template) {
		this.template = this.readTemplate(template);
		this.markdown = undefined; // We will populate this later when we render the markdown
		this.options = {
			removeFirstH1: true,
		};

		// Configure the markdown renderer
		marked.setOptions({
			renderer: createRenderer(),
		});

		this.minifyOptions = {
			removeAttributeQuotes: true,
			collapseWhitespace: true,
			html5: true,
			minifyCSS: true,
			removeEmptyElements: true,
			removeComments: false,
			useShortDoctype: true,
		};
	}

	async readTemplate(templateFile) {
		const templatePath = path.resolve(process.env.ROOT, "templates", templateFile);
		const template = await promisify(fs.readFile)(templatePath, "utf-8");
		// console.log(template)
		return template;
	}

	async renderMarkdown(sources) {
		// store markdown here
		let markdownOutput = "";

		// collect all markdown from the sources array
		for (let i = 0; i < sources.length; i++) {
			const pageSource = sources[i];
			const markdown = await downloadMarkdown(pageSource.url);
			markdownOutput += markdown;
		}

		// then render the markdown into html
		let markdownOutputHtml = marked(markdownOutput);

		if (this.options.removeFirstH1) {
			const dom = new JSDOM(markdownOutputHtml);
			const firstH1 = dom.window.document.querySelector("h1");
			if (firstH1) firstH1.remove();
			markdownOutputHtml = dom.serialize();
		}

		return markdownOutputHtml;
	}
}

module.exports = PageRenderer;
