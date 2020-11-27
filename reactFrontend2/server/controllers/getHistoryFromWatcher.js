// const crypto = require("crypto");
const fetch = require("node-fetch");
const debug = require("debug")("app:reqHistory");
const signPayload = require("../helper/signPayload");
require("dotenv").config();

// ! DEPRICATED. NO LONGER NEEDED (Changed route to use GET in 97e8729 of blogwatcher)
// ! The request can now be done directly from the client
const getPages = async (req, res) => {
	// debug(`getting hsitory for ${req.params._id}`);
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

	debug(req.query);
	const url = `${process.env.WATCHER_IP}/history/find/${req.params._id}`;
	debug(`polling ${url}`);
	const request = await fetch(url, {
		method: "post",
		body: new URLSearchParams(body),
		headers: headers,
	});
	const json = await request.json();
	// await json.json();
	console.log(json);
	return res.status(200).json(json);
};

module.exports = getPages;
// module.exports = (req, res) => {
// 	return res.status(200).json({ placeholder: "sample text" });
// };
