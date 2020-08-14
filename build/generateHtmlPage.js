const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const debug = require("debug")("staticFolio:genPage");
const getSiblings = require("./getSiblings");
const getParent = require("./getParent");
const getNeighbours = require("./getNeighbours");
require("dotenv").config();

/**
 *
 * @param {String} markdown - markdown text to use for the article
 * @param {Array} pages - array of pages from the db app
 * @param {JSOn} templateData - optional templateData
 */
const generateHtmlpage = (markdown, pages, templateData) => {
	debug(`building html page: ${templateData.page.websitePath}`);
	const html = marked(markdown);
	const parent = getParent(templateData.page.websitePath);
	const siblings = getSiblings(pages, parent, true);
	const neighbours = getNeighbours(siblings, templateData.page);

	templateData.parent = parent;
	templateData.siblings = siblings;
	templateData.neighbours = neighbours;
	// const nextSibling = siblings.indexOf(lastPathName) + 1;
	// const prevSibling = siblings.indexOf(lastPathName) - 1;
	// debug(nextSibling, prevSibling);
	// const prev = siblings.includes("thing")
	// debug(siblings);
	// debug(siblings);
};

module.exports = generateHtmlpage;
