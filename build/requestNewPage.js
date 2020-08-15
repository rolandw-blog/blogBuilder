const crypto = require("crypto");
const fetch = require("node-fetch");
const debug = require("debug")("staticFolio:reqNewPage");
const error = require("debug")("staticFolio:");

const requestNewPage = (page) => {
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
	fetch("http://10.10.10.12:8080/page", {
		method: "post",
		body: payload, // attach the payload as x-www-form-urlencoded
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"x-blogwatcher-signature": sig,
		},
	})
		.then((res) => res.json())
		.then((json) => console.log(json));
};

module.exports = requestNewPage;
