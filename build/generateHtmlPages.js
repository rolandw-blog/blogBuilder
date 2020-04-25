const path = require('path')
const fs = require('fs');
const util = require('util')
const readdirp = require('readdirp');
const emoji = require('node-emoji');
const minify = require('html-minifier').minify;
const colors = require('colors');
const mkdirp = require('mkdirp')
require('dotenv').config()

const generateHtmlPage = require('./generateHtmlPage')

const write = util.promisify(fs.writeFile)

const minifyOptions = {
	removeAttributeQuotes: true,
	collapseWhitespace: true,
	html5: true,
	minifyCSS: true,
	removeEmptyElements: true,
	removeComments: true,
	useShortDoctype: true
}

module.exports = async () => {
	let routeCounter = 0

	const pages = [];

	// ========================================
	// get every page in the directory
	for await (const filepath of readdirp("./src/views")) {
		pages.push(filepath)
	}
	console.log(`${pages.length} routes found`)


	// ========================================
	// for each filepath in src/views
	pages.forEach((filepath) => {

		// you could put some static information here
		templateData = {}

		// generated the html page
		// html page comes back with all content injected
		generateHtmlPage(templateData, filepath, process.env.GITHUB_TOKEN)
			.then((html) => {
				// Emojify it 💯
				return emoji.emojify(html)
			})
			.then((html) => {
				// Minify it 🗜
				return minify(html, minifyOptions)
			})
			.then((html) => {
				// Write it to dist 📤

				// Get some directories to create a write path

				// The base output directory
				const dist = path.resolve(process.env.ROOT, "dist")
				// The directory to place the writeDirectory
				const writeBaseDirectory = path.parse(filepath.path).dir
				// The name of the directory to place the index.html in
				const writeDirectory = path.parse(filepath.path).name.replace(/\s/g, '')

				// Builds the path for the index.html
				// For example if the output file in views/... was "Notes/topic.js"
				// ...then the fullWritePath will be ../Notes/topic/index.html
				const fullWritePathToDirectory = path.resolve(dist, writeBaseDirectory, writeDirectory)

				// write the index to root of dist. ELSE imbed it in a directory
				if (filepath.path == "index.js") {
					mkdirp(dist)
						.then(() => { write(dist + "/index.html", html) })
				} else {
					mkdirp(fullWritePathToDirectory)
						.then(() => { write(fullWritePathToDirectory + "/index.html", html) })
				}
			})
			.then(() => {
				// Increment the progress bar 📶
				routeCounter++
			})

	})
	console.log(`generated ${routeCounter} pages!\n`.magenta)

} 
