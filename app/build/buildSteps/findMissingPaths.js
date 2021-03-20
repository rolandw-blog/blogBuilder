const debug = require("debug")("build:paths");
const signPayload = require("../signPayload");
const fetch = require("node-fetch");

// get a single page by its name. Please dont enter 2 pages with the same name 😢
// use the upload form to prevent this, never manually insert data!
const getPage = async (websitePath) => {
	const body = {
		websitePath: websitePath,
		uuid: "some uuid here",
	};

	const sig = signPayload(body);

	const headers = {
		Authorization: "Bearer 3imim8awgeq99ikbmg14lnqe0fu8",
		"x-payload-signature": sig,
	};

	const url = `${process.env.WATCHER_IP}/page?pageName=${websitePath}`;

	const request = await fetch(url, {
		method: "post",
		body: new URLSearchParams(body),
		headers: headers,
	});

	const json = await request.json();
	return json;
};

/**
 *
 * @param {String} endPath Will look for a path between "/" and here.
 */
const findMissingPaths = async (endPath) => {
	const missingPaths = [];
	const pathArray = endPath.split("/").filter(String);

	let curpath = "";
	for (segment of pathArray) {
		curpath = `${curpath}/${segment}`;
		const page = await getPage(`${curpath}`);
		if (!page) missingPaths.push(curpath);
	}

	if (missingPaths.length > 0) {
		debug("MISSING PATHS");
		debug(missingPaths);
	}

	return missingPaths;
};

module.exports = findMissingPaths;
