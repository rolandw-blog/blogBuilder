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
const generateHtmlpage = require("../build/generateHtmlPage");
require("dotenv").config();

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

// Setup cors
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// Support x-www-urlencoded on all routes
app.use(urlencodedParser);

// Start the server 🚀
app.listen(process.env.PORT, () =>
	debug(`app listening at http://localhost:${process.env.PORT}`)
);

app.post("/build", [verifyPayload, urlencodedParser], (req, res) => {
	build();
	return res.status(200).json({ success: true });
});

app.post("/build/:id", [verifyPayload, urlencodedParser], async (req, res) => {
	debug(`building page ${req.params.id}`);

	// get all the pages data
	const pagesReq = await fetch(`http://10.10.10.12:8080/pages`);
	const pages = await pagesReq.json();

	// find my page in this data
	const page = pages.filter((p) => {
		if (p._id == req.params.id) {
			return p;
		}
	})[0];

	if (!page) {
		return res.status(400).json({
			success: false,
			message: `tried to find page ${req.body.id} and failed to find it`,
		});
	}

	let outputMarkdown = "";
	for (i in page.source) {
		const pageMarkdown = await read(`content/${page._id}_${i}.md`, "utf8");
		outputMarkdown += `\n${pageMarkdown}\n`;
	}

	try {
		generateHtmlpage(outputMarkdown, pages, { ...page });
		debug(`finished building page ${page._id}!`);
		return res.status(200).json({ success: true });
	} catch (err) {
		debug(`error building page ${page._id}!`);
		return res.status(500).json({
			success: false,
			message: `failed to rebuild single page ${page._id}`,
		});
	}
});

app.post("/download", [verifyPayload, urlencodedParser], (req, res) => {
	debug("downloading", req.body.fileName);
	// write the file
	if (!fs.existsSync("content")) fs.mkdirSync("content");
	fs.writeFile(`content/${req.body.fileName}`, req.body.markdown, (err) => {
		if (err) {
			debug("wrote file FAILED");
			return res.status(500).json({ success: false });
		} else {
			debug(`wrote file ${req.body.fileName}`);
			return res.status(200).json({ success: true });
		}
	});
	// return res.status(200).json({ success: true });
});

app.post("/", (req, res) => {
	debug("ROOOOOOT");
	res.status(200).json({ success: true });
});

// build();

// app.get("/build", (req, res) => {});
