const crypto = require("crypto");
const fetch = require("node-fetch");
const debug = require("debug")("staticFolio:reqNewPage");
const error = require("debug")("staticFolio:");

const requestNewPage = async (page) => {
	debug(`requesting a new page for: "${page.pageName}"...`);
	const secret = process.env.DB_API_SECRET;

	// create x-www-form-urlencoded object for posting
	const payload = new URLSearchParams(page);

	// encrypt the JSON page
	let sig =
		"sha1=" +
		crypto.createHmac("sha1", secret).update(page.toString()).digest("hex");

	debug(`signing payload: ${sig}`);

	// Attach the actual payload as x-www-form-urlencoded
	// Attach the x-blogwatcher-signature header based on the page JSON
	return fetch(`${process.env.WATCHER_IP}/page`, {
		method: "post",
		body: payload, // attach the payload as x-www-form-urlencoded
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"x-blogwatcher-signature": sig,
		},
	})
		.then((res) => res.json())
		.then((json) => json);
};

module.exports = requestNewPage;
