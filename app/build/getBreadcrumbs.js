const fetch = require("node-fetch");
const signPayload = require("./signPayload");
const debug = require("debug")("staticFolio:breadCrumbs");
const { URLSearchParams } = require("url");

const getPage = async (websitePath) => {
	// const body = { query: websitePath };
	// const params = new URLSearchParams(body);
	// const sig = signPayload(body);
	return fetch(
		`${process.env.PROTOCOL}://${process.env.WATCHER_IP}/page?websitePath=${websitePath}`
	);
};

const getBreadcrumbs = async (websitePath) => {
	const webPathArray = websitePath.split("/").filter(String);
	const result = [];

	// use this to resolve all the fetch jobs
	const jobs = [];

	// build the webpath up again
	let webpathCurrentURL = "";

	// get the first page which is not included in the webPathArray
	const home = (await getPage("/")).json();
	jobs.push(result.push(await home));

	// loop through the rest of the segments in the websitePath and get their pages
	// each time append the segment to the other ones to follow build the path
	for (segment of webPathArray) {
		webpathCurrentURL = `${webpathCurrentURL}/${segment}`;
		debug(`looking for ${webpathCurrentURL}`);
		const page = await getPage(webpathCurrentURL);
		result.push(await page.json());

		// track concurrent jobs to resolve later
		jobs.push(page);
	}

	// resolve all the page queries
	await Promise.all(jobs);
	return result;
};

module.exports = getBreadcrumbs;
