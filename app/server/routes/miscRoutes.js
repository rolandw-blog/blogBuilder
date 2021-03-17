const express = require("express");
const buildRouter = require("./buildRouter");
const debug = require("debug")("build:routers");
const router = express.Router();

const routes = [
	{
		path: "/",
		method: "get",
		middleware: [],
		handler: (req, res) => {
			res.status(200).json({
				message: "you are logged in :)",
				cookies: req.cookies,
			});
		},
		help: {
			description: "Show some info about the current logged in user",
			method: this.method,
			parameters: [],
			example: "/",
		},
	},
];

// build the router!
debug("building the build routes");
buildRouter(router, routes);

module.exports = router;
