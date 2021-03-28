const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const PageBuilder = require('../../build/pageBuilder');
const PageRenderer = require('../../build/pageRenderer');

// import functions for the templateSteps array, which is given to the PageBuilder
// to populate the templateData object within the class
const getParent = require('../../build/buildSteps/getParent');
const getSiblings = require('../../build/buildSteps/getSiblings');
const getNeighbors = require('../../build/buildSteps/getNeighbors');
const getBreadcrumbs = require('../../build/buildSteps/getBreadcrumbs');
const getDateData = require('../../build/buildSteps/getDateData');
const {getLastModified, getFirstModified} = require('../../build/buildSteps/getModified');
const {getScripts, getHeaders} = require("../../build/buildSteps/getHeadersAndScripts")

// const preSetup = async (page) => {
// 	// TODO put this in a separate function
// 	debug("writing scripts");
// 	let index = fs.readFileSync(
// 		path.resolve(process.env.ROOT, "scripts/index.js"),
// 		"utf-8"
// 	);
// 	index = await minify(index);
// 	fs.writeFileSync(
// 		path.resolve(process.env.ROOT, "dist/index.js"),
// 		index.code,
// 		{
// 			encoding: "utf8",
// 			flag: "w",
// 		}
// 	);

// 	let gist = fs.readFileSync(
// 		path.resolve(process.env.ROOT, "scripts/gist.js"),
// 		"utf-8"
// 	);
// 	gist = await minify(gist);
// 	fs.writeFileSync(
// 		path.resolve(process.env.ROOT, "dist/gist.js"),
// 		gist.code,
// 		{
// 			encoding: "utf8",
// 			flag: "w",
// 		}
// 	);
// };

const buildPage = async (req, res) => {
	console.log(`building page ${req.params.id}`);

	// define the steps we want to complete, these steps will add data to the pageBuilders templateData
	const templateSteps = [
		{name: "parent", function: (templateData) => getParent(templateData.websitePath)},
		{name: "siblings", function: (templateData) => getSiblings(templateData.parent.join("/"), 1)},
		{name: "children", function: (templateData) => getSiblings(templateData.websitePath.join("/"), 1)},
		{name: "neighbors", function: (templateData) => getNeighbors(templateData)},
		{name: "breadCrumbs", function: (templateData) => getBreadcrumbs(templateData)},
		{name: "dateData", function: (templateData) => getDateData(templateData)},
		{name: "history", function: async (templateData) => {
			const url = `${process.env.WATCHER_IP}/history/find/${templateData._id}`;
			return await (await fetch(url)).json();
		}},
		{name: "lastModified", function: (templateData) => getLastModified(templateData)},
		{name: "firstModified", function: (templateData) => getFirstModified(templateData)},
		{name: "styles", function: (templateData) => getHeaders(templateData.meta.template)},
		{name: "scripts", function: (templateData) => getScripts(templateData.meta.template)},
		{name: "templateDir", function: (templateData) => path.resolve(process.env.SRC, "templates")},
	]

	// preSetup(page);

	// now try and build it and write it to dist
	const builder = new PageBuilder(req.params.id);
	await builder.prepareTemplateData(templateSteps)
	.then(async (templateData) => {
		builder.pageRender = new PageRenderer(templateData.meta.template);
		await builder.buildAllParents();
		// await builder.build();
		return res.status(200).json(templateData);
	});
	// try {
	// } catch (err) {
	// 	// console.error(`error building page ${page._id}! ${err}`);
	// 	return res.status(500).json({
	// 		success: false,
	// 		message: `failed to rebuild single page`,
	// 	});
	// }
};

module.exports = buildPage;
