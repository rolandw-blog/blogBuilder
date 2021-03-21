const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { promisify } = require("util")
const marked = require("marked");
const createRenderer = require('./buildSteps/createRenderer');
const downloadMarkdown = require('./buildSteps/downloadMarkdown');
const { minify } = require("html-minifier");
const { throws } = require('assert');

class PageRenderer {
	constructor(template) {
		this.template = this.readTemplate(template)
		this.markdown = undefined;

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
		const templatePath = path.resolve(process.env.SRC, "templates", templateFile);
		const template = await promisify(fs.readFile)(templatePath, "utf-8");
		// console.log(template)
		return template;
	}


	renderMarkdown(markdown) {
		// render out the markdown to html
		let html = marked(markdown)

		// returns a function for currying
		return (steps) => {
			// iterate over the postProcessingSteps array and apply the functions to the
			for (const step of steps) {
				html = step(html)
			}
			return html
		}
	}

	async renderPage(sources) {
		// store markdown here
		let markdownOutput = "";

		// collect all markdown from the sources array
		for (let i = 0; i < sources.length; i++) {
			const pageSource = sources[i];
			const markdown = await downloadMarkdown(pageSource.url);
			markdownOutput += markdown;
		}

		const postProcessingSteps = [
			(html) => minify(html, this.minifyOptions),
		]

		// then render the markdown into html
		const markdownOutputHtml = this.renderMarkdown(markdownOutput)(postProcessingSteps);
		console.log(markdownOutputHtml);
	}
}

module.exports = PageRenderer