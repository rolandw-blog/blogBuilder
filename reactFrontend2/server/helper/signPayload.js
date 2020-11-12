const crypto = require("crypto");
const debug = require("debug")("app:crypto");
require("dotenv").config();

/**
 *
 * @param {JSON} body
 */
const signPayload = (body) => {
	debug("signing payload");
	const secret = process.env.DB_API_SECRET;
	debug(`The secret is: ${secret}`);
	debug(`the stringified body is:`);
	debug(JSON.stringify(body));

	let sig =
		"sha1=" +
		crypto
			.createHmac("sha1", secret)
			.update(JSON.stringify(body))
			.digest("hex");
	debug(sig);
	return sig;
};

module.exports = signPayload;
