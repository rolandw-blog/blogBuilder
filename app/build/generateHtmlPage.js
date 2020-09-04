const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const emoji = require("node-emoji");
const { minify } = require("html-minifier");
const getSiblings = require("./getSiblings");
const getParent = require("./getParent");
const getNeighbours = require("./getNeighbours");
const writeHtml = require("./writeHtml");
const createRenderer = require("./createRenderer");
const getBreadcrumbs = require("./getBreadcrumbs");
const deletePage = require("./deletePage");
const debug = require("debug")("staticFolio:genPage");
require("dotenv").config();

const minifyOptions = {
	removeAttributeQuotes: true,
	collapseWhitespace: true,
	html5: true,
	minifyCSS: true,
	removeEmptyElements: true,
	removeComments: true,
	useShortDoctype: true,
};

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
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/gist.css" />`
			);
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/an-old-hope.css" />`
			);
			break;
		case "home.ejs":
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/home.css" />`
			);
			break;
		case "menu.ejs":
			scripts.push(
				`<link rel="stylesheet" type="text/css" href="/menu.css" />`
			);
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
 * @param {String} html - rendered html to parse through for extra stuff
 */
const postProcessing = (html) => {
	// then parse for emoji 💯
	html = emoji.emojify(html);
	try {
		// TODO fix this mess
		// ! for some reason this fails when you use interesting utf8
		// ! ...at least i think thats the cause
		// Minify it 🗜
		html = minify(html, minifyOptions);
		return html;
	} catch (err) {}
	// return it
	return html;
};

const mongoIDtoDate = (_id) => {
	return new Date(parseInt(_id.substring(0, 8), 16) * 1000);
};

/**
 *
 * @param {String} markdown - markdown text to use for the article
 * @param {Array} pages - array of pages from the db app
 * @param {JSOn} templateData - optional templateData
 */
const generateHtmlpage = async (markdown, templateData) => {
	debug(`Building html for ${templateData.source.length} sources`);

	// import the custom renderer from createRenderer.js
	marked.setOptions({
		renderer: createRenderer(),
	});

	// determine info for building
	const html = marked(markdown);
	const parent = getParent(templateData.websitePath);
	debug("getting siblings");
	const siblings = await getSiblings(parent, true);
	debug("getting children");
	const children = await getSiblings(templateData.websitePath, true);
	debug("getting neighbours");
	const neighbours = getNeighbours(siblings, templateData);
	debug("getting breadcrumbs");
	const breadCrumbs = await getBreadcrumbs(templateData.websitePath);
	debug("getting date data");
	const dateData = mongoIDtoDate(templateData._id);

	// last edit date
	let modDate;
	let lastEdit = {};
	const historyHead =
		templateData.meta.history[templateData.meta.history.length - 1];
	if (historyHead != undefined) {
		// modified date of the most recent thing in the history head
		modDate = new Date(historyHead.timestamp);

		lastEdit = {
			full: modDate,
			year: modDate.getFullYear(),
			month: modDate.getMonth() + 1,
			day: modDate.getDate(),
			hour: modDate.getHours(),
			message: historyHead.message,
		};
	}

	// set template content for injection
	templateData.content = html;
	templateData.backLink = parent;
	templateData.parentPath = parent;
	templateData.parentName = path.parse(templateData.parentPath).name;
	templateData.siblings = siblings;
	templateData.children = children;
	templateData.neighbours = neighbours;
	templateData.breadCrumbs = breadCrumbs;
	templateData.scripts = assignScripts(templateData.meta.template);
	templateData.styles = assignStyles(templateData.meta.template);
	templateData.templateDir = path.resolve(process.env.ROOT, "templates");
	templateData.lastEdit = lastEdit || undefined;
	templateData.createdDate = {
		full: dateData,
		year: dateData.getFullYear(),
		month: dateData.getMonth() + 1,
		day: dateData.getDate(),
		hour: dateData.getHours(),
	};

	// read in the requested template
	const templateName = templateData.meta.template || "template.ejs";
	const template = fs.readFileSync(
		path.resolve(`templates/${templateName}`),
		"utf-8"
	);

	// rendered html result
	const result = postProcessing(ejs.render(template, templateData));

	// write the html
	writeHtml(result, templateData);
};

module.exports = generateHtmlpage;
