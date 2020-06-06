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

// ! choo choo its the code police! Idealy this should be converting the jsonToc to markdown and then converting it
// ! that would make it way more "unified" and intergrated with the rest of the md -> html workflow...
// ! ...if json is passed then it should be json -> md -> html to allow markedjs to change render the md instead
/**
 * needs to take {type: 'heading', depth: INT, text: 'STRING' }. returns UL or OL ToC in html
 * @param {JSON} jsonToc - json object created by marked lexer thats been filtered to just type: headings
 * @param {boolean} ordered - Generate a UL or OL list
 */
const jsonTOC2html = (jsonToc, ordered) => {
	let tocItems = "";
	let currentindent = 0;
	const listSymbol = (ordered) ? "ol" : "ul";

	tocItems += `<div class="table-of-contents">`;
	for (heading of jsonToc) {
		// sanitize to get anchor friendly tags
		let anchorLink = heading.text.toLowerCase().replace(/[^\w]+/g, "-")
		anchorLink = anchorLink.replace(/"|'|`/g, '');
		// filter out small headings
		if (heading.depth < 4) {
			tocItems += `<li class="listAnchorDepth${heading.depth}"><a class="plainHyperLink" href=#${anchorLink}>${heading.text}</a></li>`
		}
	}

	for (let i = 0; i < currentindent; i++) {
		tocItems += `</${listSymbol}>`;
	}

	tocItems += "</div>";

	return tocItems;
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
		let escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
		// sanitize the link anchors
		escapedText = escapedText.replace(/"|'|`/g, '');
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
	const tokens = marked.lexer(markdown)
	// get just the headings from the tokens by filtering it
	const headings = tokens.filter(token => token.type === 'heading')
	// generate a html ToC
	const toc = jsonTOC2html(headings)

	templateData.toc = toc;

	const html = ejs.render(templateFile, await templateData)

	return { html: html, templateData: templateData }

}

module.exports = generateHtmlpage

// Fetching content from github can be done like this
// const response =  fetch('https://github.com/');
// const data =  response.text();
// console.log(data); 
