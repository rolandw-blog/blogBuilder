const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const PageBuilder = require("../../build/pageBuilder");
const PageRenderer = require("../../build/pageRenderer");
const AssetManager = require("../../build/assetManager");

// import functions for the templateSteps array, which is given to the PageBuilder
// to populate the templateData object within the class
const getParent = require("../../build/buildSteps/getParent");
const getSiblings = require("../../build/buildSteps/getSiblings");
const getNeighbors = require("../../build/buildSteps/getNeighbors");
const getBreadcrumbs = require("../../build/buildSteps/getBreadcrumbs");
const getDateData = require("../../build/buildSteps/getDateData");
const { getLastModified, getFirstModified } = require("../../build/buildSteps/getModified");
const { getScripts, getHeaders } = require("../../build/buildSteps/getHeadersAndScripts");

// template steps
const templateSteps = require("../../build/common/templateSteps");
const postProcessingSteps = require("../../build/common/postProcessingSteps");

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

	// preSetup(page);

	try {
		const assetManager = new AssetManager();
		assetManager.renderCSS();
		assetManager.renderJS();
		// assetManager.copyMedia();
	} catch (err) {
		return res.status(500).json(err);
	}

	try {
		// Create a builder for this page
		const builder = new PageBuilder(req.params.id);

		// Get the template data ready
		const templateData = await builder.prepareTemplateData(templateSteps);

		// Create a page renderer for the associated template
		builder.pageRender = new PageRenderer(templateData.meta.template);

		// Build all the parents of the page
		await builder.buildAllParents(templateSteps, postProcessingSteps);

		// build the page itself
		await builder.build(postProcessingSteps);

		// return the pages template data for the UI frontend
		return res.status(200).json(templateData);
	} catch (err) {
		return res.status(500).json(err);
	}
};

module.exports = buildPage;
