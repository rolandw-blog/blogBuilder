const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const mkdirp = require("mkdirp");
const debug = require("debug")("staticFolio:genPage");
const wrote = require("debug")("out_staticFolio:wrotePage");
const log = require("debug")("v_staticFolio:log");
const error = require("debug")("staticFolio:ERROR");
const getSiblings = require("./getSiblings");
const getParent = require("./getParent");
const getNeighbours = require("./getNeighbours");
require("dotenv").config();

const assignScripts = (template) => {
	const scripts = [];
	switch (template) {
		case "template.ejs":
			scripts.push(`<script src="/gist.js"></script>`);
			break;
		case "blogPost.ejs":
			scripts.push(`<script src="/gist.js"></script>`);
			break;
		case "home.ejs":
			scripts.push(`<script src="/index.js"></script>`);
			break;
		default:
			break;
	}
	return scripts;
};

const assignStyles = (template) => {
	const scripts = [];
	switch (template) {
		case "template.ejs":
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/light.css" />`
			);
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/gist.css" />`
			);
			break;
		case "blogPost.ejs":
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/light.css" />`
			);
			break;
		case "home.ejs":
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/dark.css" />`
			);
			break;
		default:
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/dark.css" />`
			);
			break;
	}
	return scripts;
};

/**
 *
 * @param {String} markdown - markdown text to use for the article
 * @param {Array} pages - array of pages from the db app
 * @param {JSOn} templateData - optional templateData
 */
const generateHtmlpage = async (markdown, pages, templateData) => {
	debug(`Building html for ${templateData.source.length} sources`);

	// determine info for building
	const html = marked(markdown);
	const parent = getParent(templateData.websitePath);
	const siblings = getSiblings(pages, parent, true);
	const children = getSiblings(pages, templateData.websitePath, true);
	const neighbours = getNeighbours(siblings, templateData);

	// set template content for injection
	templateData.content = html;
	templateData.backLink = parent;
	templateData.parentPath = parent;
	templateData.parentName = path.parse(templateData.parentPath).name;
	templateData.siblings = siblings;
	templateData.children = children;
	templateData.neighbours = neighbours;
	templateData.scripts = assignScripts(templateData.meta.template);
	templateData.styles = assignStyles(templateData.meta.template);
	templateData.templateDir = path.resolve(process.env.ROOT, "templates");

	// read in the requested template
	const templateName = templateData.meta.template || "template.ejs";
	const template = fs.readFileSync(
		path.resolve(`templates/${templateName}`),
		"utf-8"
	);

	// rendered html result
	const result = ejs.render(template, templateData);

	// get paths to write to
	const relativeWebPath = templateData.websitePath.substring(1);
	const writePath = path.resolve("dist", relativeWebPath, "index.html");
	const distpath = path.resolve("dist", relativeWebPath);
	log("writePath", path.relative(".", writePath));
	log("distpath", path.relative(".", distpath));

	// make the dir
	await mkdirp(path.resolve("dist", distpath)).catch((err) => {
		error(err);
	});

	// write a html file here
	fs.writeFile(writePath, result, (err) => {
		if (err) error(err);
		else wrote(`Wrote:\t${templateData.websitePath}`);
	});
};

module.exports = generateHtmlpage;
