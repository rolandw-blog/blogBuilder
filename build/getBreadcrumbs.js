const fetch = require("node-fetch");
const signPayload = require("./signPayload");
const debug = require("debug")("v_staticFolio:breadCrumbs");

const getPage = async (websitePath, callback) => {
	const sig = signPayload({ query: websitePath });
	const page = await fetch(
		`http://${process.env.WATCHER_IP}/page?websitePath=${websitePath}`,
		{
			method: "GET",
			headers: { "x-payload-signature": sig },
		}
	);
	callback(await page.json());
};

const getBreadcrumbs = async (websitePath) => {
	const webPathArray = websitePath.split("/").filter(String);
	const result = [];

	// use this to resolve all the fetch jobs
	const jobs = [];

	// build the webpath up again
	let webpathCurrentURL = "";

	// get the first page which is not included in the webPathArray
	jobs.push(getPage("/", (json) => result.push(json)));

	// loop through the rest of the segments in the websitePath and get their pages
	// each time append the segment to the other ones to follow build the path
	for (segment of webPathArray) {
		webpathCurrentURL = `${webpathCurrentURL}/${segment}`;
		debug(`looking for ${webpathCurrentURL}`);
		const page = getPage(webpathCurrentURL, (json) => {
			result.push(json);
		});

		// track concurrent jobs to resolve later
		jobs.push(page);
	}

	// resolve all the page queries
	await Promise.all(jobs);
	return result;
};

module.exports = getBreadcrumbs;
