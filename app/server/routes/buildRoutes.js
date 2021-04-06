const express = require("express");
const bodyParser = require("body-parser");
const buildRouter = require("./buildRouter");
const debug = require("debug")("build:routers");
const router = express.Router();

// controllers
const buildPage = require("../controllers/buildPage");

const routes = [
	{
		path: "/:id",
		method: "get",
		middleware: [],
		handler: buildPage,
		help: {
			description: "Build 1 route",
			method: this.method,
			parameters: [],
			example: "/5f3fb41fdb3c861093356530",
		},
	}
];

// build the router!
buildRouter(router, routes);

module.exports = router;
