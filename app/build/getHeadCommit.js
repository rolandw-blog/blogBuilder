const debug = require("debug")("staticFolio:GetHeadCommit");
const fetch = require("node-fetch");
/**
 * Return the commit data for the HEAD of this repo
 */
const getHeadCommit = async () => {
	// ? put the repo name here
	const repo = "rolandWarburton/staticFolio";
	const url = `https://${process.env.GITHUB_TOKEN}@api.github.com/repos/${repo}/commits/master`;

	debug("fetching head commit information");
	return fetch(url, { method: "get" })
		.then((res) => {
			if (res.status != 200)
				throw new Error("couldnt get head, probably rate limited");
			return res.json();
		})
		.then((json) => {
			return json;
		})
		.catch((err) => {
			debug(err);
			return undefined;
		});
};

module.exports = getHeadCommit;
