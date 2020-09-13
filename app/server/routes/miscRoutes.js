const express = require("express");
const bodyParser = require("body-parser");
const buildRouter = require("./buildRouter");
const verifyPayload = require("../middleware/verifyPayload");
const debug = require("debug")("staticFolio:routers");
const router = express.Router();

// controllers
const buildPage = require("../controllers/buildPage");
const buildPages = require("../controllers/buildPages");

// ! Single Sign On system
const isAuthenticated = require("../middleware/isAuthenticated");

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
	limit: "50mb",
	extended: true,
});

// ! remember to protect the routes in production
//  [urlencodedParser, verifyPayload]
const routes = [
	{
		path: "/build_ui",
		method: "get",
		middleware: [isAuthenticated],
		handler: (req, res) => {
			res.render("index.ejs");
		},
		help: {
			description: "Build 1 route",
			method: this.method,
			parameters: [],
			example: "/5f3fb41fdb3c861093356530",
		},
	},
];

// build the router!
debug("building the build routes");
buildRouter(router, routes);

module.exports = router;
