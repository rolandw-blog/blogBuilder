const fetch = require("node-fetch");

const getSiblings = async (websitePath) => {
	const url = `${process.env.WATCHER_IP}/page?websitePath=/${websitePath}&level=1`;
	const options = {
		method: "GET"
	}
	
	const request = await fetch(url, options);
	const response = await request.json();
	// console.log(await response)
	return response;
};

module.exports = getSiblings;
