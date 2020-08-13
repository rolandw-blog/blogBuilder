const path = require("path");
const fs = require("fs");
const util = require("util");
const readdirp = require("readdirp");
const marked = require("marked");
const emoji = require("node-emoji");
const minify = require("html-minifier").minify;
const colors = require("colors");
const mkdirp = require("mkdirp");
const ProgressBar = require("progress");
const fetch = require("node-fetch");
const argv = require("yargs").argv;
const debug = require("debug")("staticFolio:genPages");
const info = require("debug")("staticFolio:genInfo");
require("dotenv").config();
const generateHtmlPage = require("./generateHtmlPage");
const { check } = require("yargs");
const read = util.promisify(fs.readFile);

const checkIfPageExists = (pageName) => {
	fetch("https://api.github.com/users/github")
		.then((res) => res.json())
		.then((json) => console.log(json));
};

/**
 *
 * @param {JSON} siteLayout - Json object of the site with each page nested inside it
 * @param {Array} mask - Mask to restrict the output of JSON siblings
 * @example getNeighbours({sample: {path: {one: {}}}}, "sample.path")
 */
const getNeighbours = (siteLayout, mask) => {
	let maskedLayout = siteLayout;
	// drill through the sitelayout to get to the correct child
	for (i in mask) {
		maskedLayout = maskedLayout[mask[i]];
	}

	// return the children on this new masked json object
	return Object.keys(maskedLayout);
};

const databaseAddress = "10.10.10.12";

module.exports = async () => {
	const siteLayout = await fetch(`http://${databaseAddress}:8080/preview`)
		.then((res) => res.json())
		.then((json) => {
			return json;
		});
	// debug(JSON.stringify(siteLayout, null, 2));
	// debug(JSON.parse("{ out: { here1: {}, here2: {} }, in: { here3: {} }"));
	getNeighbours(siteLayout, ["out", "here"]);

	// const a = {
	// 	out: {
	// 		here1: {},
	// 	},
	// 	out2: {
	// 		here2: {},
	// 	},
	// 	in: {
	// 		here3: {},
	// 	},
	// };
	// debug("=====");
	// debug(JSON.stringify(a.out, null, 2));
	// debug(JSON.stringify(siteLayout.out, null, 2));

	// debug(a.b);

	// debug("reading files");
	// // get all the page db info
	// const files = fetch(`http://${databaseAddress}:8080/pages`)
	// 	.then((res) => res.json())
	// 	.then((json) => {
	// 		return json;
	// 	});

	// // for each file
	// for (file of await files) {
	// 	info(`building page ${file.pageName}`);
	// 	let outputMarkdown = "";
	// 	// for each markdown file on this page
	// 	for (i in file.source) {
	// 		debug(`reading: ${file._id}_${i}.md`);
	// 		// read the file and add it to the output
	// 		const pageMarkdown = read(`content/${file._id}_${i}.md`, "utf8");
	// 		outputMarkdown += `\n${await pageMarkdown}\n`;
	// 	}
	// 	generateHtmlPage(outputMarkdown, {});
	// }
	// debug("done");
};
