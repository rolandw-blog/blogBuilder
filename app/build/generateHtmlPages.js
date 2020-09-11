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
const signPayload = require("./signPayload");
require("dotenv").config();

const fetchPages = () => {
	debug(`fetching: ${process.env.WATCHER_IP}/pages`);

	const body = {
		temp: "gimmie pages pls",
	};

	const sig = signPayload(body);

	const headers = {
		Authorization: "Bearer 3imim8awgeq99ikbmg14lnqe0fu8",
		"x-payload-signature": sig,
	};

	debug(sig);

	return fetch(`${process.env.WATCHER_IP}/pages`, {
		method: "post",
		body: new URLSearchParams(body),
		headers: headers,
		credentials: "include",
	})
		.then((res) => res.json())
		.then((json) => {
			debug(`fetched ${json.length} pages!`);
			return json;
		});
};

/**
 * Return the commit data for the HEAD of this repo
 */
const getHeadCommit = async () => {
	// put the repo name here
	const repo = "rolandWarburton/staticFolio";
	const url = `https://api.github.com/repos/${repo}/commits/master`;

	debug("fetching head commit information");
	return fetch(url, { method: "get" })
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

	// get the head commit data
	const head = await getHeadCommit();

	// for each page
	for (page of pages) {
		timer("=========================================================");
		debug(`Building page:\t${page.pageName}`);

		let outputMarkdown = await read(`content/${page._id}.md`, "utf8");

		// ! check for missing paths
		const missingPaths = await findMissingPaths(page.websitePath);

		// ! if missing paths were found create them
		if (missingPaths.length > 0) {
			debug(`missing paths: ${missingPaths}`);

			// request the missing paths to be created into pages
			const newPages = await requestNewPages(missingPaths);

			// update the pages array with the newly added pages
			pages.push(...newPages);
		}

		// ! build the page
		await generateHtmlPage(outputMarkdown, { ...page, head: head });
	}
	debug("done");
};
