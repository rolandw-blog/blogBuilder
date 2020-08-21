const path = require("path");
const fs = require("fs");
const util = require("util");
const express = require("express");
const debug = require("debug")("staticFolio:server");
const verifyPayload = require("./middleware/verifyPayload");
const build = require("../build");
const cors = require("cors");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const renderSass = require("../build/renderSass");
const generateHtmlpage = require("../build/generateHtmlPage");
const signPayload = require("../build/signPayload");
require("dotenv").config();

const buildRoutes = require("./routes/buildRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

const copy = util.promisify(fs.copyFile);
const read = util.promisify(fs.readFile);

// this needs to be 50mb to stop the server from crapping itself
// with a "request entity too large" error
const urlencodedParser = bodyParser.urlencoded({
	limit: "50mb",
	extended: true,
});

// Create server
const app = express();

app.use("/build", buildRoutes);
app.use("/download", downloadRoutes);

// Setup cors
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// Support x-www-urlencoded on all routes
app.use(urlencodedParser);

// Start the server 🚀
app.listen(process.env.PORT, () =>
	debug(`app listening at http://localhost:${process.env.PORT}`)
);

// // ! DONT forget to add [verifyPayload] to the middleware for production
// app.get("/build", [urlencodedParser], (req, res) => {
// 	build();
// 	return res.status(200).json({ success: true });
// });

// // ! DONT forget to add [verifyPayload] to the middleware for production
// app.get("/build/:id", [urlencodedParser], async (req, res) => {
// 	debug(`building page ${req.params.id}`);

// 	// get all the pages data
// 	const pagesReq = await fetch(`http://10.10.10.12:8080/pages`);
// 	const pages = await pagesReq.json();

// 	// try and download the page from blog watcher
// 	const body = { id: req.params.id };
// 	const sig = signPayload(body);

// 	// fetch the page fresh from blog watcher
// 	let result = await fetch(`http://10.10.10.12:8080/build/${req.params.id}`, {
// 		method: "GET",
// 		headers: { "x-payload-signature": sig },
// 	});
// 	result = await result.json();
// 	page = result.page;

// 	// ! this is a temp holdover from build() all pages
// 	// TODO seperate this into its own function or something
// 	renderSass("src/styles/dark.scss", "dist/dark.css");
// 	renderSass("src/styles/light.scss", "dist/light.css");
// 	renderSass("src/styles/blue.scss", "dist/blue.css");
// 	renderSass("src/styles/gist.scss", "dist/gist.css");
// 	renderSass("src/styles/home.scss", "dist/home.css");
// 	renderSass("src/styles/menu.scss", "dist/menu.css");

// 	let outputMarkdown = await read(`content/${page._id}.md`, "utf8");

// 	// now try and build it and write it to dist
// 	try {
// 		generateHtmlpage(outputMarkdown, pages, { ...page });
// 		debug(`finished building page ${page._id}!`);
// 		return res.status(200).json({ success: true });
// 	} catch (err) {
// 		debug(`error building page ${page._id}!`);
// 		return res.status(500).json({
// 			success: false,
// 			message: `failed to rebuild single page ${page._id}`,
// 		});
// 	}
// });

// download markdown from blog watcher
// app.post("/download/:id", [verifyPayload, urlencodedParser], (req, res) => {
// 	debug("downloading", req.params.id);
// 	// write the file
// 	if (!fs.existsSync("content")) fs.mkdirSync("content");
// 	fs.writeFile(`content/${req.params.id}.md`, req.body.markdown, (err) => {
// 		if (err) {
// 			debug("wrote file FAILED");
// 			return res.status(500).json({ success: false });
// 		} else {
// 			debug(`wrote file ${req.params.id}`);
// 			return res.status(200).json({ success: true });
// 		}
// 	});
// });

// // download all markdown from blogwatcher
// app.get("/download", [urlencodedParser], async (req, res) => {
// 	debug("downloading everything");
// 	await fetch(`http://10.10.10.12:8080/build`, {
// 		method: "GET",
// 	});
// 	return res.status(200).json({ success: true });
// });

app.post("/", (req, res) => {
	debug("ROOOOOOT");
	res.status(200).json({ success: true });
});

// build();

// app.get("/build", (req, res) => {});
