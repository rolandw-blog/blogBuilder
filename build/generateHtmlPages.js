const path = require('path')
const fs = require('fs');
const util = require('util')
const readdirp = require('readdirp');
const emoji = require('node-emoji');
const minify = require('html-minifier').minify;
const colors = require('colors');
const mkdirp = require('mkdirp')
const ProgressBar = require('progress');
const fetch = require('node-fetch')
const argv = require('yargs').argv
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

const fetchGitData = async function (url) {
	const data = fetch(url, { headers: { 'Content-Type': 'application/json' } })
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			// if (json.length == 0) throw Error("json length fetched was 0");
			return json;
		})
		.catch((err) => {
			console.log(err)
		})

	return data;
}

/**
* @param {URL} url - the url
*/
const constructGithubApiCommitRequest = function (url) {
	const repoParts = url.pathname.split("/")
	const author = repoParts[1];
	const repoName = repoParts[2];
	repoParts.splice(0, 4);
	const repoPath = repoParts.join("/");

	// for some reason encoreURIComponent breaks the whole url so i need to encode &'s as a special case at the cost of optimization :(
	const apiUrl = `https://${process.env.GITHUB_TOKEN}@api.github.com/repos/${author}/${repoName}/commits?path=${repoPath.replace("&", "%26")}`
	return apiUrl;
}



const generateAndWriteHTML = async function (templateData, filepath) {
	await generateHtmlPage(templateData, filepath)
		.then(({ html, templateData }) => {
			// Emojify it 💯
			html = emoji.emojify(html);
			// Minify it 🗜
			html = minify(html, minifyOptions);

			return html;
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
			// const fullWritePathToDirectory = 
			const fullWritePathToDirectory = (filepath.path != "index.js") ?
				path.resolve(dist, writeBaseDirectory, writeDirectory, "index.html")
				: path.resolve(dist, "index.html");

			// write it to the dist folder
			mkdirp(path.parse(fullWritePathToDirectory).dir)
				.then(() => { write(fullWritePathToDirectory, html) }).catch(err => console.log(err))

			return filepath
		})
		.catch(err => console.log(err))
}

const tickBar = (bar) => {
	if (!argv.q) {
		bar.tick({
			'currentFile': path.parse(filepath.path).name
		})
	}
}

module.exports = async () => {
	// number of pages read
	let pageTotal = 0
	// number of targets read
	let targetTotal = 0;
	// track the url targets as a KVP array of filepaths and targets
	const targetURLTracker = [];
	// 
	const pageFilepaths = [];

	const bar = new ProgressBar(':bar :current :currentFile', { total: 1000, width: 30 });


	const buildData = await fetchGitData(`https://${process.env.GITHUB_TOKEN}@api.github.com/repos/RolandWarburton/staticFolio/commits/refs/heads/master`);
	console.log(`Commit ID ${buildData.sha.substring(0, 4)}`)
	fs.appendFileSync("log.txt", `\n${new Date().toISOString()} started build on ${buildData.sha.substring(0, 4)}`);

	// you could put some static information here
	templateData = {
		build: {
			sha: (buildData.sha).substring(0, 4),
			date: buildData.commit.author.date,
			author: buildData.commit.author
		}
	}
	
	// Get every page in the src/views and concurrently generate and write html to dist
	readdirp("./src/views/", { fileFilter: '*.js', alwaysStat: false })
	.on('data', (filepath) => {
		pageTotal++;
		// get the targets
		const targets = require(filepath.fullPath).target;
		const lengthOfTargets = (targets) ? targets.length : 0;

		// Add these targets to the filepath to target tracker
		targetURLTracker.push({
			filepath: filepath.fullPath,
			targets: targets
		})

		// Increment the number of total targets
		targetTotal += lengthOfTargets;
		
		pageFilepaths.push(filepath);
		})
		.on('end', () => {
			console.log(`finished reading local files (${pageTotal})`);

			// now that we have the number of files that we need to source
			// update the total number of ticks required to fill the progress bar
			// console.log(`found ${pageTotal} pages and ${targetTotal} targets`.blue)
			bar.total = pageTotal;
			// =================================================================================

			// for each filepath
			for (filepath of pageFilepaths) {
				// generate a file and then tick the bar
				generateAndWriteHTML(templateData, filepath)
					.then((result) => {
						tickBar(bar);
					})
			}
		})
}
