const fetch = require("node-fetch");
const debug = require("debug")("build:DEV_HotReload");
const ip = require("internal-ip");
const signPayload = require("../../build/signPayload");

/**
 * ! DEBUG METHOD
 * Rebuild a page via the api, only for debug purposes
 * @param {String} id - ID of the page
 */
const devRebuildPage = (id) => {
	// TODO allow bools to be passed to the verifpayload system
	// TODO it doesnt work rn because of stringify on the payload signer
	const body = {
		id: id,
		redownloadPage: "false",
	};

	const sig = signPayload(body);

	const headers = {
		Authorization: "Bearer 3imim8awgeq99ikbmg14lnqe0fu8",
		"x-payload-signature": sig,
	};

	const ipaddr = ip.v4.sync();
	const url = `${process.env.PROTOCOL}://${ipaddr}:${process.env.PORT}/build/${id}`;
	debug(url);
	return fetch(url, {
		method: "post",
		headers: headers,
		body: new URLSearchParams(body),
	})
		.then((data) => data.json())
		.then((json) => {
			// debug(json);
		});
};

const execute = () => {
	// in this order, rebuild some pages for dev purposes (pseudo hot reload)
	// Home, notes, Customising Linux
	Promise.all([
		devRebuildPage("5f36713524f4a368d7e2117c"),
		devRebuildPage("5f39187aa50877014564db6e"),
		devRebuildPage("5f3a2442f5e888024714709f"),
	]);
};

module.exports = { devRebuildPage, execute };
