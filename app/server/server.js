const path = require("path");
const fs = require("fs");
const express = require("express");
const debug = require("debug")("staticFolio:server");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const checkSSORedirect = require("./middleware/checkSSORedirect");
const isAuthenticated = require("./middleware/isAuthenticated");
const fetch = require("node-fetch");
const ip = require("internal-ip");
const signPayload = require("../build/signPayload");
const devRebuildPage = require("../build/devFunctions/rebuildPage");
require("dotenv").config();

const buildRoutes = require("./routes/buildRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

debug("============================================");
debug("Blog builder is starting...");
debug(`WORKING IN:\t${process.env.ROOT}`);
debug(`RUNNING ON PORT:\t${process.env.PROTOCOL}`);
debug(`WATCHER IP:\t${process.env.WATCHER_IP}`);
debug("============================================");

if (!fs.existsSync("dist")) fs.mkdirSync("dist");

// this needs to be 50mb to stop the server from crapping itself
// with a "request entity too large" error
const urlencodedParser = bodyParser.urlencoded({
	limit: "50mb",
	extended: true,
});

// Create server
const app = express();

// express session configuration
// ! Single Sign On system
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 3600000,
		},
	})
);

// check for sign on communications from the sso server
// ! Single Sign On system
app.use(checkSSORedirect());

// run authentication on all GET routes
// app.use(isAuthenticated);

// routes
app.use("/build", buildRoutes);
app.use("/download", downloadRoutes);

// quick and dirty upload form
app.use(
	"/build_ui",
	[isAuthenticated],
	express.static(path.resolve(process.env.ROOT, "public"))
);

// Setup cors
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// Support x-www-urlencoded on all routes
app.use(urlencodedParser);

// Start the server 🚀
app.listen(process.env.PORT, async () => {
	debug(`app listening at http://localhost:${process.env.PORT}`);

	if (
		process.env.NODE_ENV == "development" &&
		process.env.rebuildPagesOnStart == true
	) {
		// ! pseudo hot reload
		devRebuildPage.execute();
	}
});

// ! Single Sign On system
app.get("/", isAuthenticated, (req, res, next) => {
	// const now = new Date().toISOString();
	debug(`This session is: ${req.session.id}`);
	res.status(200).json({
		what: `SSO-Consumer One`,
		title: "Blog Builder | Home",
		role: req.session.user.role,
		email: req.session.user.email,
		uid: req.session.user.uid,
		globalSessionID: req.session.user.globalSessionID,
		iat: req.session.user.iat,
		exp: req.session.user.exp,
		iss: req.session.user.iss,
		cookie: req.session.cookie || "not sure",
		expires: req.session.cookie.maxAge / 1000 + "'s",
	});
});

// ! Single Sign On system (error handling)
app.use((err, req, res, next) => {
	if (err) debug("some ERROR occurred:");
	console.error({
		message: err.message,
		error: err,
	});
	const statusCode = err.status || 500;
	let message = err.message || "Internal Server Error";

	debug(`Eror status: ${err.status}`);
	debug(`Status Code: ${statusCode}`);

	if (statusCode === 500) {
		message = "Internal Server Error";
	}
	res.status(statusCode).json({
		message: message,
		returnCode: statusCode,
		actualStatusCode: err.statusCode,
		query: req.query,
		route: req.route,
		err: {
			error: err,
			errorMessage: err.message,
		},
		url: {
			params: req.params,
			url: req.url,
			ogURL: req.originalUrl,
			baseURL: req.baseURL,
			hostname: req.hostname,
			path: req.path,
		},
		cookies: req.cookies,
	});
});
