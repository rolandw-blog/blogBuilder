const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const marked = require('marked')
const hljs = require('highlight.js')
const crypto = require('crypto')
const log = require('./log')
const getFilepathNeighbours = require('./getFilepathNeighbours');
const getPrevPath = require('./getPrevPath');
require('dotenv').config()

// !!! The following function is garbage and isnt being used
// its part of the ToC generator that is on hold until the end of semester/i have more time to work on it.
// I left it in the master branch because im lazy and VC is hard
/**
 * needs to take {type: 'heading', depth: INT, text: 'STRING' }
 * @param {JSON} jsonToc - json object created by marked lexer thats been filtered to just type: headings
 */
const jsonTOC2md = (jsonToc) => {
	const itemLength = jsonToc.length;
	let tocItems = "";

	const toc = [];


	// set the renderer
	const renderer = new marked.Renderer()
	renderer.list = (body, ordered, start) => {
		return `<div>${body}</div>`;
	}

	renderer.listitem = (body, ordered, start) => {
		return `<span>${body}</span>\n`;
	}

	renderer.paragraph = (text) => {
		const extractedResults = text.split("|||")
		const depth = extractedResults[0];
		const title = extractedResults[1]
		return `<li class="indent-${depth}">${title}</li>`;
	}

	const tokenizer = {
		paragraph(src) {
			console.log("src");
			return false;
		}
	}

	// ! bad. this is bad
	for (let i = 0; i < jsonToc.length; i++) {
		const heading = jsonToc[i];
		
		const r = marked(`${heading.depth}|||${heading.text}`, { renderer: renderer})
		
		console.log(r)
		fs.appendFileSync("temp.html", r)
	}
}

// TODO just make this a const variable. No need to recall/regenerate it each time the page is built
// the only time you would need to do this is if im passing parameters to createRenderer()
// * Create a marked js renderer that puts share anchors inside heading dom elements
/**
 * 
 * @param {string} title - Take a title of the article. Will append it to h2 tags for easier navigation
 */
const createRenderer = () => {
	const renderer = new marked.Renderer();
	renderer.heading = (text, level) => {
		const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
		let output;

		output = `
			<strong onmouseover="togglePermalinkAnchor('${escapedText}', true);" onmouseleave="togglePermalinkAnchor('${escapedText}', false)">
				<h${level} id="${escapedText}">
					${text}
					<a 
						name="${escapedText}" 
						id="${escapedText}-permalinkAnchor" 
						onClick="copyUrlToClipboard('${escapedText}')" 
						class="plainHyperLink gistShareAnchor" 
						title="Permalink to this headline"
						href="#${escapedText}">
						#
					</a>	
				</h${level}>
			</strong>`;
		return output;
	}
	return renderer;
}

// * fetch one to many markdown files. returns string of concatinated markdown
/**
 * 
 * @param {Array} targets - An array of urls pointing to markdown
 * @param {string} pageTitle - The title to use on subheadings (eg h2, h3). Passed to createRenderer
 */
const fetchContent = async function (targets, pageTitle) {
	// concat multiple markdown files into this
	let markdownContent = ""

	let title = "";

	// return nothing if theres no targets
	if (targets == undefined) {
		return "";
	}

	// for each potential target for a single page (there may be 1 to many)
	for (let i = 0; i < targets.length; i += 1) {
		const target = targets[i]
		try {
			// the url to pull markdown from
			const url = decodeURI(target)

			// the current markdown for this url
			let markdown = ""

			// fetch the content in async. await the response immediately
			const response = await fetch(url.replace("TOKEN", process.env.GITHUB_TOKEN.trim()));

			// complain if the content doesnt return
			if (response.status != 200) {
				fs.appendFileSync("log.txt", `\n${new Date().toISOString()} ${target} returned ${response.status}`);
				throw `${target} returned ${response.status}`;
			}

			// extract the text markdown
			markdown += await response.text()

			marked.setOptions({
				highlight: function (code) {
					return hljs.highlightAuto(code).value;
				},
				renderer: createRenderer()
			});

			markdownContent += markdown;
		} catch (err) {
			console.log(`\n${err}\n`.red.bold)
		}
	}

	// return the markdown in markdown format
	return markdownContent;
}

const generateHtmlpage = async function (templateData, filepath, githubToken) {

	const links = getFilepathNeighbours(filepath)
	const backlink = path.normalize(getPrevPath(filepath.path))
	const title = path.parse(filepath.path).name

	templateData = {
		...templateData,
		links: { next: links.next, prev: links.prev },
		backlink: backlink,
		title: title,
		markdown: "",
		content: "",
		styles: undefined
	}

	// pass down the root env variable to make it accessible in the template
	templateData.ROOT = process.env.ROOT

	// get the page content from the js file by requiring the modules template
	let templatePath = require(filepath.fullPath).template
	if (templatePath == null) templatePath = "./templates/template.ejs"

	// get the templateFile for this route
	const templateFile = fs.readFileSync(path.resolve(process.env.ROOT, templatePath), "utf-8")

	// get the page content from the js file by requiring the modules page
	templateData.content = require(filepath.fullPath).page

	// get the target (if any) from the js file by requiring the modules target
	// .target referrers to the online content that this page wants to pull
	templateData.target = require(filepath.fullPath).target

	templateData.uniqueSources = (templateData.target) ? templateData.target.length : 0;

	// add markdown styles
	if (templateData.target != "") {
		templateData.styles = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/an-old-hope.css\">"
	}

	// fetch the content using node-fetch
	const markdown = await fetchContent(templateData.target, templateData.title)
	templateData.markdown = marked(markdown)

	// TODO markedjs heading tokens -> html TOC generator
	// get the toc as a json array of markedjs tokens
	// const tokens = marked.lexer(markdown)
	// get just the headings from the tokens by filtering it
	// const headings = tokens.filter(token => token.type === 'heading')
	// generate a html ToC
	// jsonTOC2md(headings)

	const html = ejs.render(templateFile, await templateData)

	return { html: html, templateData: templateData }

}

module.exports = generateHtmlpage

// Fetching content from github can be done like this
// const response =  fetch('https://github.com/');
// const data =  response.text();
// console.log(data); 
