const jwt = require("jsonwebtoken");
const url = require("url");
const debug = require("debug")("app:recvToken");
const fetch = require("node-fetch");
require("dotenv").config();
// send token back to server to check that it has a matching session

const ISSUER = "simple-sso";
const verifyJwtToken = (token, clientSecret) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, clientSecret, { issuer: ISSUER }, (err, decoded) => {
			if (err) return reject(err);
			return resolve(decoded);
		});
	});
};

module.exports = async (req, res, next) => {
	const token = req.query.token;
	if (token) {
		// extract the token that we need to decode with the clients secret
		const { token } = req.query;

		debug(`received the token "${token}"`);

		// decode the token with our client secret
		const clientSecret = process.env.CLIENT_SECRET;
		const decoded = await verifyJwtToken(token, clientSecret);
		debug(`verified the received token with _id: "${decoded._id}"`);

		// decode the token and send it back to sso to wait for it to be verified
		// if its verified you will receive the users details in the response
		const headers = {
			Authorization: `Bearer ${decoded._id}`,
		};

		const options = {
			method: "GET",
			headers: headers,
		};

		debug("retrieving end user session key");
		const payload = await (
			await fetch(process.env.TOKEN_VERIF_URL, options)
		).json();

		const user = await verifyJwtToken(payload.token, clientSecret);
		debug(user);

		debug("setting the user in the browser session");
		req.session.user = user;

		// then redirect to the intended location
		debug("reduirecting back to the client");
		// extract the path that we will go to after this
		const redirectUrl = req.query.serviceURL;
		return res.redirect(redirectUrl);
	}

	next();
};
