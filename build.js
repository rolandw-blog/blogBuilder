const path = require("path");
const fs = require("fs-extra");
const generateHtmlPages = require("./build/generateHtmlPages");
const renderSass = require("./build/renderSass");
// const server = require("./server/server");
const util = require("util");
const debug = require("debug")("staticFolio:Build");
require("dotenv").config();

const build = () => {
	debug("BUILDING");
	// set the ROOT
	process.env.ROOT = __dirname;

	const copy = util.promisify(fs.copyFile);

	// copy js to dist
	copy("scripts/gist.js", "dist/gist.js");
	copy("scripts/index.js", "dist/index.js");

	// copy media to dist
	if (!fs.existsSync("dist/media")) fs.mkdirSync("dist/media");
	for (f of fs.readdirSync("src/media")) {
		copy(`src/media/${f}`, `dist/media/${f}`);
	}

	// copy code styles to dist
	copy("src/styles/an-old-hope.css", "dist/an-old-hope.css");

	// render sass and copy to dist
	renderSass("src/styles/dark.scss", "dist/dark.css");
	renderSass("src/styles/light.scss", "dist/light.css");
	renderSass("src/styles/blue.scss", "dist/blue.css");
	renderSass("src/styles/gist.scss", "dist/gist.css");
	renderSass("src/styles/home.scss", "dist/home.css");
	renderSass("src/styles/menu.scss", "dist/menu.css");

	// generate the pages! 🚀
	// debug("BUILDING");
	generateHtmlPages();
};

module.exports = build;
