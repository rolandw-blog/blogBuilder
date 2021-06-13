const fetch = require("node-fetch");

const getPage = async (websitePath, level) => {
	const url = `${process.env.WATCHER_IP}/page?websitePath=/${websitePath}`;

	// Request body
	const options = {
		method: "GET"
	}

	// do the request
	const request = await fetch(url, options);
	const response = await request.json();
	return response;
};

const getBreadcrumbs = async (templateData, options) => {
	const { websitePath } = templateData;
	const { includeHome } = options || false;

	// use this to resolve all the fetch jobs
	const jobs = [];
	const pages = [];

	// copy the array to temp so we can pop elements from it
	const temp = [...websitePath];
	do {
		// path: "/"		becomes ""
		// path: "/foo"		becomes "/foo"
		// path: "/foo/bar"	becomes "/foo/bar"
		const pagePath = (temp.join("/") == "/") ? "" : temp.join("")

		// then get the page based on the pagePath
		jobs.push(getPage(pagePath).then(page => {
			// if there a page then store it
			if (page.length !== 0) pages.push(page[0])
		}));

		// remove the end of the array
		temp.pop();
	} while(temp.length !== 0);

	// push the root page as well if requested
	if (includeHome) jobs.push(getPage("").then(page => pages.push(page[0])));

	// wait for all the pages to come back
	await Promise.all(jobs);

	// Sort by websitePathLength in ascending order
	pages.sort((a, b) => {
		if (a.websitePathLength > b.websitePath) return 1;
		else return -1;
	})

	const test = pages.filter((page) => page != undefined);

	return pages;
};

module.exports = getBreadcrumbs;
