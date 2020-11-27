// const crypto = require("crypto");
const fetch = require("node-fetch");
const debug = require("debug")("app:updatePage");
const signPayload = require("../helper/signPayload");
require("dotenv").config();

const getPages = async (req, res) => {
	debug("UPDATING PAGE");

	// if (!req.query)
	// 	return res.status(422).json({
	// 		success: false,
	// 		message: "query required in the form of ?oldValue=newValue",
	// 	});

	debug("PARAMS:");
	debug(req.params);
	debug("QUERY:");
	debug(req.query);
	debug("BODY:");
	debug(req.body);

	const body = {
		_id: req.params.id,
		uuid: "some random uuid here",
	};

	const sig = signPayload(body);
	const headers = {
		Authorization: "Bearer 3imim8awgeq99ikbmg14lnqe0fu8",
		"x-payload-signature": sig,
	};

	// get the key and val
	debug("creating queryKey");
	const queryKey = Object.keys(req.query)[0];
	debug("creating queryVal");
	const queryVal = req.query[queryKey];
	debug(`key and val is {${queryKey}: ${queryVal}}`);

	const params = new URLSearchParams({
		[queryKey]: queryVal,
	});

	const url = `${process.env.WATCHER_IP}/update/${req.params.id}?${params}`;
	debug(`polling ${url}`);
	const request = await fetch(url, {
		method: "post",
		body: new URLSearchParams(body),
		headers: headers,
	});
	const document = await request.json();
	console.log("received reply");
	console.log(document);
	return res.status(200).json({ ...document });
};

module.exports = getPages;
