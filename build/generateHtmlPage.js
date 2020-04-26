const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const marked = require('marked')
const log = require('./log')
const hljs = require('highlight.js')
const getFilepathNeighbours = require('./getFilepathNeighbours');
const getPrevPath = require('./getPrevPath');
require('dotenv').config()

marked.setOptions({
	highlight: function (code) {
		return hljs.highlightAuto(code).value;
	}
});

const fetchContent = async function (targets) {
	// concat multiple markdown files into this
	let markdownContent = ""
	if (targets != undefined) {
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
				if (response.status != 200) throw `${target} returned ${response.status}`;

				// extract the text markdown
				markdown += await response.text()
				markdownContent += marked(markdown)
			} catch (err) {
				console.log(`${err}`.red.bold)
			}
		}

		return markdownContent
	} else {
		return ""
	}
}

const generateHtmlpage = async function (templateData, filepath, githubToken) {

	const links = getFilepathNeighbours(filepath)
	const backlink = path.normalize(getPrevPath(filepath.path))
	const title = path.parse(filepath.path).name

	templateData = {
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

	// add markdown styles
	if (templateData.target != "") {
		templateData.styles = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/an-old-hope.css\">"
	}

	// fetch the content using node-fetch
	templateData.markdown = await fetchContent(templateData.target)

	const html = ejs.render(templateFile, templateData)
	return html

}

module.exports = generateHtmlpage

// Fetching content from github can be done like this
// const response =  fetch('https://github.com/');
// const data =  response.text();
// console.log(data); 
