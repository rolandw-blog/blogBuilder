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

module.exports = async () => {
	let pageTotal = 0
	let pageCurrent = 0

	const bar = new ProgressBar(':bar :current :currentFile', { total: 1000, width: 30 });

	const pageFilepaths = [];

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
	readdirp("./src/views", { fileFilter: '*.js', alwaysStat: false })
		.on('data', (filepath) => {
			// increment the total number of pages found
			pageTotal++;
			pageFilepaths.push(filepath);
		})
		.on('end', () => {
			// now that we have the number of files
			// update the total number of ticks required to fill the progress bar
			bar.total = pageTotal;
			console.log(`finished reading local files (${pageTotal})`);

			// for this filepath
			pageFilepaths.map((filepath) => {
				// get the targets as an array
				const targets = require(filepath.fullPath).target;

				// get the output filepath to write the hash information to 
				const hashFilepath = path.resolve("fileHashes", path.parse(filepath.path).name + ".json");

				// bool to track if the hashes are the same. if not set to true then the page will be built
				let hashMatch = false;

				// create an array to store promises that will later be fufilled to become commit data (from the api)
				const gitData = [];
				if (targets) {
					// put all the git data promises into gitData to resolve
					for (url of targets) {
						// a url might look like: https://api.github.com/repos/RolandWarburton/knowledge/commits?path=Linux/Terminals.md
						const targetRequestURL = constructGithubApiCommitRequest(new URL(url))
						const data = fetchGitData(targetRequestURL)
						gitData.push(data)
					}

					// resolve all of gitData into github commit json from the api
					Promise.all(gitData).then((allCommitData) => {
						// update the progress bar
						if (!argv.q) {
							bar.tick({
								'currentFile': path.parse(filepath.path).name
							})
						}

						// create a json structure to store the hash in
						// ! could be bit buggy because it needs to handle any amount of targets and the fetching system will only
						// ! randomly store the most recent hash only that happened to return last
						const newFileHash = []

						// for each commitData for this page (0 to many)
						for (commit of allCommitData) {
							// put it in the newFileHash list
							newFileHash.push({ filepath: filepath, sha: commit[0].sha });
						}

						// read the old hash for this page
						fs.readFile(hashFilepath, (err, data) => {
							// if the file was found
							if (!err) {
								// else the hash file was found... parse it
								const oldFileHashe = JSON.parse(data);

								// if the hash we have doesnt match the new one
								if (newFileHash[0].sha == oldFileHashe[0].sha) {
									// page is up to date ❤
									// console.log("page is up to date. skipping")
									hashMatch = true;
								}
							}

							// hash file either doesnt exist or does not match the new hash
							if (!hashMatch) {
								// write the hash to fileHashes/*
								fs.writeFile(hashFilepath, JSON.stringify(newFileHash), () => { })
							}
						})
					});
				} else {
					// no targets for this file
					if (!argv.q) {
						bar.tick({
							'currentFile': path.parse(filepath.path).name
						})
					}
				}
				// if theres no match then write it!
				if (!hashMatch) {
					generateAndWriteHTML(templateData, filepath);
				}
			})
		})
}
