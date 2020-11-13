const express = require("express");
const buildRouter = require("./buildRouter");
// const bodyParser = require("body-parser");
// const verifyPayload = require("../middleware/verifyPayload");
const debug = require("debug")("app:routers");
const router = express.Router();

// controllers
const getPagesFromWatcher = require("../controllers/getPagesFromWatcher");
const updatePage = require("../controllers/updatePage");
const getHistoryFromWatcher = require("../controllers/getHistoryFromWatcher");

// ! Single Sign On system
// const isAuthenticated = require("../middleware/isAuthenticated");

// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({
// 	limit: "50mb",
// 	extended: true,
// });

// ! remember to protect the routes in production
//  [urlencodedParser, verifyPayload]
const routes = [
	{
		path: "/pages",
		method: "get",
		middleware: [],
		handler: getPagesFromWatcher,
		help: {
			description: "Get all pages from the blog watcher API",
			method: this.method,
			parameters: [],
			example: "/pages",
		},
	},
	{
		path: "/update/:id",
		method: "post",
		middleware: [],
		handler: updatePage,
		help: {
			description: "Update a document in the database",
			method: this.method,
			parameters: ["pageName: string"],
			example: "/aaabbbccc?pageName=MyPage",
		},
	},
	{
		path: "/history/find/:_id",
		method: "get",
		middleware: [],
		handler: getHistoryFromWatcher,
		help: {
			description: "Get all pages from the blog watcher API",
			method: this.method,
			parameters: [],
			example: "/pages",
		},
	},
];

// build the router!
debug("building the api routes");
buildRouter(router, routes);

module.exports = router;
