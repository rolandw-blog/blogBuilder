const crypto = require("crypto");
const debug = require("debug")("build:crypto");

/**
 *
 * @param {JSON} body
 */
const signPayload = (body) => {
	const secret = process.env.DB_API_SECRET;
	const jsonBody = body;
	// debug(JSON.stringify(body));
	let sig =
		"sha1=" +
		crypto
			.createHmac("sha1", secret)
			.update(JSON.stringify(jsonBody))
			.digest("hex");
	// debug(sig);
	return sig;
};

module.exports = signPayload;
