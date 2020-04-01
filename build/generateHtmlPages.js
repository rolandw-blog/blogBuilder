const path = require('path')
const fs = require('fs');
const util = require('util')
const readdirp = require('readdirp');
const emoji = require('node-emoji');
const minify = require('html-minifier').minify;
const colors = require('colors');
const mkdirp = require('mkdirp')

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
	const fp = path.resolve(process.cwd(), "githubToken.txt")
	const githubToken = fs.readFileSync(fp)

	for await (const filepath of readdirp("./src/views")) {

		templateData = {}


		// wait for the generated page to be loaded in
		// html page comes back with all content injected
		let html = await generateHtmlPage(templateData, filepath, githubToken)

		// parse it for emoji
		html = emoji.emojify(html)

		// make it smol
		html = minify(html, minifyOptions)

		// get a filepath to the write directory
		// the directory structure should look like...
		// EG: views/notes will belong in dist/notes/index.html
		const writeDir = (filepath.path != "index.js") ?
			path.resolve(process.cwd(), "dist", path.parse(filepath.path).dir, path.parse(filepath.path).name).replace(/\s/g, '')
			: path.resolve(process.cwd(), "dist").replace(/\s/g, '')

		// make the dir with -p (recursive) and then write it to writeDir/index.html 
		mkdirp(writeDir).then(dirname => { write(writeDir + "/index.html", html) })

		// keep count of the number of pages generated
		routeCounter++
	}
	console.log(`generated ${routeCounter} pages!\n`.magenta)

} 