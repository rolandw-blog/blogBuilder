const url = require("url");
const debug = require("debug")("app:isAuth");
require("dotenv").config();

module.exports = async (req, res, next) => {
	debug("isAuthenticated middleware");
	const user = req.session.user;
	const host = req.get("host");
	const hostPathname = url.parse(req.url).pathname;

	if (!user) {
		// need to go get a token
		debug("going to the SSO server");
		// create service url
		const serviceURL =
			req.protocol + "://" + req.get("host") + req.originalUrl;

		// create redirect url
		const ssoServerURL = `${process.env.PROMPT_LOGIN_URL}?serviceURL=${serviceURL}`;
		return res.redirect(ssoServerURL);
	}
	next();
};
