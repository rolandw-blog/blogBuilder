const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
const debug = require("debug")("staticFolio:genPages");
const timer = require("debug")("staticFolio:timer");
const ProgressBar = require("progress");
const generateHtmlPage = require("./generateHtmlPage");
const findMissingPaths = require("./findMissingPaths");
const requestNewPages = require("./requestNewPages");
const deletePage = require("./deletePage");
const read = util.promisify(fs.readFile);
require("dotenv").config();

const fetchPages = () => {
	debug(
		`fetching: ${process.env.PROTOCOL}://${process.env.WATCHER_IP}/pages`
	);

	return fetch(`${process.env.PROTOCOL}://${process.env.WATCHER_IP}/pages`)
		.then((res) => res.json())
		.then((json) => {
			debug(`fetched ${json.length} pages!`);
			return json;
		});
};

module.exports = async () => {
	debug("fetching pages");

	// get all the page db info
	let pages = await fetchPages();

	// for each page
	for (page of pages) {
		timer("=========================================================");
		debug(`Building page:\t${page.pageName}`);

		let outputMarkdown = await read(`content/${page._id}.md`, "utf8");

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
			const newPages = await requestNewPages(missingPaths);

			// update the pages array with the newly added pages
			pages.push(...newPages);
		}

		// ! build the page
		await generateHtmlPage(outputMarkdown, pages, { ...page });
	}
	debug("done");
};
