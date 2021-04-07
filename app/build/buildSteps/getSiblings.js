const fetch = require("node-fetch");

// level 0 = EXACT path only
// level 1 = neighbors
// level 2 = neighbors and neighbors children

const getSiblings = async (websitePath, level) => {
	// URL for the request
	const url = `${process.env.WATCHER_IP}/page?websitePath=/${websitePath}&level=${level || 1}`;

	// Request body
	const options = {
		method: "GET",
	};

	// do the request
	const request = await fetch(url, options);
	const response = await request.json();

	// remove the root path "/"
	// 		The reason why we want to do this is because if we are building the homepage
	// 		we dont need to place a link to "/" on the "/" path. We dont need to worry about this for other cases (yet anyway)
	const removedRootPath = response.filter(curr => curr.websitePath.join("/") !== "");
	return removedRootPath;
};

module.exports = getSiblings;
