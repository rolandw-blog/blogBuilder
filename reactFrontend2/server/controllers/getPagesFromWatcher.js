// const crypto = require("crypto");
const fetch = require("node-fetch");
const debug = require("debug")("app:reqAllPages");
const signPayload = require("../helper/signPayload");
require("dotenv").config();

const getPages = async (req, res) => {
	debug("getting pages");
	const websitePath = req.query.websitePath || "";
	const body = {
		websitePath: websitePath,
		uuid: "some random uuid here",
	};

	const sig = signPayload(body);
	const headers = {
		Authorization: "Bearer 3imim8awgeq99ikbmg14lnqe0fu8",
		"x-payload-signature": sig,
	};

	const regQuery =
		websitePath !== ""
			? `?websitePath=${websitePath}.*[^/]&regex=true`
			: "";

	const url = `${process.env.WATCHER_IP}/pages${regQuery}`;
	debug(`polling ${url}`);
	const request = await fetch(url, {
		method: "post",
		body: new URLSearchParams(body),
		headers: headers,
	});
	const json = await request.json();
	debug(json.length);
	return res.status(200).json({ data: json });
};

module.exports = getPages;
