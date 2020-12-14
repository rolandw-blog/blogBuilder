const jwt = require("jsonwebtoken");
const url = require("url");
const debug = require("debug")("app:recvToken");
const fetch = require("node-fetch");
// send token back to server to check that it has a matching session
// const userawait;
// req.session.user = { token: token };

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

		// extract the path that we will go to after this
		const redirectURL = url.parse(req.url).pathname;

		debug(`received the token "${token}"`);

		// decode the token with our client secret
		const clientSecret = "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL";
		const decoded = await verifyJwtToken(token, clientSecret);
		debug(`verified the received token with _id: "${decoded._id}"`);

		// decode the token and send it back to sso to wait for it to be verified
		// if its verified you will receive the users details in the response

		const tokenVerifUrl = `http://devel:3000/auth/verifyToken`;

		const headers = {
			Authorization: `Bearer ${decoded._id}`,
		};

		const options = {
			method: "GET",
			headers: headers,
		};

		debug("retrieving end user session key");
		const payload = await (await fetch(tokenVerifUrl, options)).json();
		// debug(payload);
		// debug(payload.user);
		const user = await verifyJwtToken(payload.user, clientSecret);
		debug(user);

		debug("setting the user in the browser session");
		req.session.user = user;

		// const decodedToken = decode(token)
		// fetch(devel:3000/auth/verifyToken, {post})
		// req.session.user = response

		// then redirect to the intended location
		debug("reduirecting back to the client");
		const redirectUrl = `http://${req.get("host")}`;
		return res.redirect(redirectUrl);
	}

	next();
};
