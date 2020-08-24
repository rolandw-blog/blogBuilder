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

debug("============================================");
debug("Blog builder is starting...");
debug(`WORKING IN:\t${process.env.ROOT}`);
debug(`RUNNING ON PORT:\t${process.env.PROTOCOL}`);
debug(`WATCHER IP:\t${process.env.PROTOCOL}:${process.env.WATCHER_IP}`);
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

app.use("/build", buildRoutes);
app.use("/download", downloadRoutes);

// quick and dirty upload form
app.use("/upload", express.static(path.resolve(process.env.ROOT, "public")));

// Setup cors
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// Support x-www-urlencoded on all routes
app.use(urlencodedParser);

// Start the server 🚀
app.listen(process.env.PORT, () =>
	debug(`app listening at http://localhost:${process.env.PORT}`)
);

app.post("/", (req, res) => {
	debug("ROOOOOOT");
	res.status(200).json({ success: true });
});

// build();

// app.get("/build", (req, res) => {});
