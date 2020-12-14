const getSession = require("../helpers/getSession");
const url = require("url");
const debug = require("debug")("app:isAuth");
require("dotenv").config();

const isTokenProvided = (token, verbose = false) => {
	if (token) {
		verbose && debug("a token was provided");
		debug(true);
	} else {
		verbose && debug("no token was provided");
		return false;
	}
};

const isClientHasSession = async () => {
	if (!req.locals.session) {
	}
};

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
		const ssoServerURL = `https://api.blog.rolandw.dev/auth/promptLogin?serviceURL=${serviceURL}`;
		return res.redirect(ssoServerURL);
	}
	next();
};
