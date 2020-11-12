const url = require("url");
const axios = require("axios");
const debug = require("debug")("auth_app:checkSSORedirect");
// const fetch = require("node-fetch");
const { verifyJwtToken } = require("./jwt_verify");
const ssoServerJWTURL = "https://login.rolandw.dev/simplesso/verifytoken";

// TODO Do some validation that the origin of the request came from the SSO server
// const validReferOrigin = "https://login.rolandw.dev";

// ! Single Sign On system
const ssoRedirect = () => {
	// debug("running checkSSORedirect");
	return async function (req, res, next) {
		debug("running checkSSORedirect");

		// ! the sso token is passed to the client when the client is authenticating with the sso server.
		// ! This client then sends a response back to the "ssoServerJWTURL" to validate its receipt of the token using its Client secret (Bearer secret)
		const { ssoToken } = req.query;
		debug(`ssoToken: "${ssoToken}"`);

		if (ssoToken != null) {
			debug(`the token exists!`);
			// get the ssoToken in query parameter redirect.
			const redirectURL = url.parse(req.url).pathname;
			try {
				debug(`requesting the decoded token for "${ssoToken}"`);

				const headers = {
					Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
				};

				// TODO move to using node-fetch instead of axios
				const requrl = `${ssoServerJWTURL}?ssoToken=${ssoToken}`;
				// const request = await fetch(requrl, { headers: headers });
				// const response = await request.json();

				// const response = await fetch(requrl, { headers: headers });
				const response = await axios.get(requrl, { headers: headers });
				const { token } = response.data;
				debug(`received the token" ${token}`);
				const decoded = await verifyJwtToken(token);
				debug(`decoded the token ${JSON.stringify(decoded)}`);

				// ! Create a session for this user
				debug(req.session);
				req.session.user = decoded;
			} catch (err) {
				debug("ERRRRRRROR D:");
				return next(err);
			}

			debug(`redirecting to: "${redirectURL}"`);
			return res.redirect(`${redirectURL}`);
		}

		return next();
	};
};

module.exports = ssoRedirect;
