const path = require("path");
const fs = require("fs");
const util = require("util");
const express = require("express");
const debug = require("debug")("staticFolio:server");
const verifyPayload = require("./middleware/verifyPayload");
const build = require("../build");
const cors = require("cors");
require("dotenv").config();

const copy = util.promisify(fs.copyFile);

// Create server
const app = express();

// Setup cors
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// Support x-www-urlencoded on all routes
app.use(express.urlencoded({ extended: true }));

// Start the server 🚀
app.listen(process.env.PORT, () =>
	debug(`app listening at http://localhost:${process.env.PORT}`)
);

app.post("/build", verifyPayload, (req, res) => {
	debug("BUILDING");
	const jobs = [];
	build();
	return res.status(200).json({ success: true });
});

app.post("/build/:id", verifyPayload, (req, res) => {
	const jobs = [];
	return res.status(200).json({ success: true });
});

app.post("/download", verifyPayload, (req, res) => {
	debug("downloading", req.body.fileName);
	// write the file
	if (!fs.existsSync("content")) fs.mkdirSync("content");
	fs.writeFile(`content/${req.body.fileName}`, req.body.markdown, (err) => {
		if (err) {
			return res.status(500).json({ success: false });
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

app.post("/", (req, res) => {
	debug("ROOOOOOT");
	res.status(200).json({ success: true });
});

// app.get("/build", (req, res) => {});
