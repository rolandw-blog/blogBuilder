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

const buildPage = async (req, res) => {
	console.log(`building page ${req.params.id}`);

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
		builder.pageRender = new PageRenderer(await templateData.meta.template);

		// Build all the parents of the page
		await builder.buildAllParents(templateSteps, postProcessingSteps);

		// build the page itself
		try {
			await builder.build(postProcessingSteps);
		} catch (err) {
			console.log(err);
		}

		// return the pages template data for the UI frontend
		return res.status(200).json(templateData);
	} catch (err) {
		return res.status(500).json(err);
	}
};

module.exports = buildPage;
