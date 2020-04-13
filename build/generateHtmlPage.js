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

const generateHtmlpage = async function (templateData, filepath, githubToken) {

	const links = await getFilepathNeighbours(filepath)
	const backlink = await path.normalize(getPrevPath(filepath.path))
	const title = path.parse(filepath.path).name

	templateData = {
		links: { next: links.next, prev: links.prev },
		backlink: backlink,
		title: title
	}


	// get the page content from the js file by requiring the modules template
	let templatePath = await require(filepath.fullPath).template
	if (templatePath == null) templatePath = "./templates/template.ejs"

	// get the templateFile for this route
	const templateFile = await fs.readFileSync(path.resolve(process.env.ROOT, templatePath), "utf-8")

	// get the page content from the js file by requiring the modules page
	templateData.content = await require(filepath.fullPath).page

	// get the target (if any) from the js file by requiring the modules target
	// .target referrers to the online content that this page wants to pull
	templateData.target = await require(filepath.fullPath).target

	// pass down the root env variable to make it accessible in the template
	templateData.ROOT = process.env.ROOT

	// Fetch content from github if the page exported any target link
	if (templateData.target != null) {
		let data = '';
		const count = templateData.target.length
		
		for(let i = 0; i < count; i ++) {
			const response = await fetch(templateData.target[i].replace("TOKEN", githubToken.trim()));
			const result = await response.text();
			data = await data + "\n" + result
			// console.log(templateData.target[i])
		}

		templateData.target = marked(data);
		templateData.styles = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/an-old-hope.css\">"
	} else {
		// return nothing because there was no content to load
		templateData.target = undefined
		templateData.styles = undefined
	}

	// render html from the template provided. and bake in the templateData json object
	const html = await ejs.render(templateFile, templateData)
	return (html)

}

module.exports = generateHtmlpage

// Fetching content from github can be done like this
// const response = await fetch('https://github.com/');
// const data = await response.text();
// console.log(data); 
