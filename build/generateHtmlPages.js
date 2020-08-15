const path = require("path");
const fs = require("fs");
const util = require("util");
const readdirp = require("readdirp");
const marked = require("marked");
const emoji = require("node-emoji");
const minify = require("html-minifier").minify;
const colors = require("colors");
const mkdirp = require("mkdirp");
const ProgressBar = require("progress");
const fetch = require("node-fetch");
const argv = require("yargs").argv;
const debug = require("debug")("staticFolio:genPages");
const timer = require("debug")("staticFolio:timer");
require("dotenv").config();
const generateHtmlPage = require("./generateHtmlPage");
const findMissingPaths = require("./findMissingPaths");
const requestNewPage = require("./requestNewPage");
const { check } = require("yargs");
const read = util.promisify(fs.readFile);

const databaseAddress = "10.10.10.12";

const generateMissingPaths = async (missingPaths) => {
	const result = [];
	if (missingPaths.length == 0) {
		return null;
	}

	for (missingPath of missingPaths) {
		// get the missing path as an array
		const pathArray = missingPath.split("/");

		// get the name
		const missingPageName = pathArray[pathArray.length - 1];

		// make a new page for submission
		const newPage = {
			pageName: missingPageName,
			meta: {
				template: "menu.ejs",
			},
			source: [],
			websitePath: missingPath,
		};

		// post the new page
		const createdPage = await requestNewPage(newPage);
		result.push(createdPage);
	}
	return result;
};

const fetchPages = () => {
	return fetch(`http://${databaseAddress}:8080/pages`)
		.then((res) => res.json())
		.then((json) => {
			debug(`fetched ${json.length} pages!`);
			return json;
		});
};

module.exports = async () => {
	// const siteLayout = await fetch(`http://${databaseAddress}:8080/preview`)
	// 	.then((res) => res.json())
	// 	.then((json) => {
	// 		return json;
	// 	});

	debug("fetching pages");
	// get all the page db info
	let pages = await fetchPages();

	// for each page
	for (page of pages) {
		timer("=========================================================");
		debug(`Building page:\t${page.pageName}`);
		let outputMarkdown = "";

		// ! for each markdown page on this page
		for (i in page.source) {
			debug(`reading:\t${page._id}_${i}.md`);

			// read the page and add it to the output
			const pageMarkdown = read(`content/${page._id}_${i}.md`, "utf8");
			outputMarkdown += `\n${await pageMarkdown}\n`;
		}

		// ! check for missing paths
		const missingPaths = await findMissingPaths(
			"/",
			page.websitePath,
			pages
		);

		// ! if missing paths were found create them
		if (missingPaths.length > 0) {
			debug(`missing paths: ${missingPaths}`);

			// request the missing paths to be created into pages
			const newPages = await generateMissingPaths(missingPaths);

			// update the pages array with the newly added pages
			pages.push(...newPages);
		}

		// build the page
		await generateHtmlPage(outputMarkdown, pages, { ...page });
	}
	debug("done");
};
