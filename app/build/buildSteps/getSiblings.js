const fetch = require("node-fetch");

// level 0 = EXACT path only
// level 1 = neighbors
// level 2 = neighbors and neighbors children

const getSiblings = async (websitePath, level) => {
	// URL for the request
	const url = `${process.env.WATCHER_IP}/page?websitePath=/${websitePath}&level=${level || 1}`;

	// Request body
	const options = {
		method: "GET"
	}

	// do the request
	const request = await fetch(url, options);
	const response = await request.json();
	return response;
};

module.exports = getSiblings;
