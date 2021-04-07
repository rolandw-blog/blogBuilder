const fs = require("fs");
const path = require("path");
const csso = require("csso");
const fetch = require("node-fetch");
const ejs = require("ejs");
const PageRender = require("./pageRenderer");
require("dotenv").config();

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// import helper functions for the PageBuilder
const renderSass = require("./buildSteps/handleAssets/renderSass");
const writeHtml = require("./buildSteps/writeHtml");

// import functions for the templateSteps array, which is given to the PageBuilder
// to populate the templateData object within the class
const getParent = require("./buildSteps/getParent");
const getSiblings = require("./buildSteps/getSiblings");
const getNeighbors = require("./buildSteps/getNeighbors");
const getBreadcrumbs = require("./buildSteps/getBreadcrumbs");
const getDateData = require("./buildSteps/getDateData");
const { getLastModified, getFirstModified } = require("./buildSteps/getModified");
const { getScripts, getHeaders } = require("./buildSteps/getHeadersAndScripts");

// template steps
// const templateSteps = require("./common/templateSteps")

// postProcessing functions
const { minify } = require("html-minifier");

class PageBuilder {
	constructor(id, renderer) {
		if (!fs.existsSync("dist")) fs.mkdirSync("dist");
		this.id = id;
		this._templateData = this.getPage(id);
		this.pageRender = renderer || undefined;
		this.parentPages = [];
	}

	async build(postProcessingSteps) {
		postProcessingSteps = postProcessingSteps.length === 0 ? [] : postProcessingSteps;
		const sources = await this._templateData.source;
		this._templateData.content = await this.pageRender.renderMarkdown(sources);

		const template = await this.pageRender.template;
		let html = "";
		try {
			html = ejs.render(template, this._templateData);
		} catch (err) {
			console.log(`There was an error while ejs template. ${err}`);
		}

		// run post processing on the html
		for (const step of postProcessingSteps) {
			try {
				html = step(html);
			} catch (err) {
				console.log(
					`There was an error while post processing the html on step ${step}. We will skip this step.`
				);
			}
		}

		writeHtml(html, this._templateData);
		return html;
	}

	async buildAllSiblings(templateSteps, postProcessingSteps) {
		const siblings = [...(await this._templateData.siblings)];
		const jobs = [];

		// build every sibling page
		for (const node of siblings) {
			const pageRender = new PageRender(node.meta.template);
			const pageBuilder = new PageBuilder(node._id, pageRender);
			console.log(`building sibling ${node.pageName}`);
			await pageBuilder.prepareTemplateData(templateSteps);
			try {
				pageBuilder.build(postProcessingSteps);
			} catch (err) {
				console.log(`Error building sibling ${node._id}`);
				console.log(err);
			}
		}
	}

	async buildAllParents(templateSteps, postProcessingSteps) {
		const websitePath = [...(await this._templateData.websitePath)];
		const jobs = [];

		// loop through each parent from /foo/bar/baz to /foo/bar to /foo to /
		// to exclude / change the loop to "> 1"
		do {
			// remove the end of the path
			websitePath.pop();

			// construct the parent with the new path
			const websitePathParent = websitePath.join("/");

			console.log(`Building parent ${websitePathParent}`);

			// create the URL to fetch with
			const url = `${process.env.WATCHER_IP}/page?websitePath=/${websitePathParent}`;

			// fetch the page data for this parent
			const parent = fetch(url, { method: "GET" })
				.then((data) => data.json())
				.then((json) => json[0]);

			// If the parent is defined for any parent path then that means that the page probably doesnt exist
			// We should log that so that the developer can add that missing page, otherwise the user cant navigate to it
			if (
				(websitePathParent !== "" && (await parent) === undefined) ||
				(await parent) === null
			) {
				// TODO log an error
				console.warn(`the url ${url} returned an unexpected value: ${await parent}`);
			}

			jobs.push(parent); // push the parent fetch job to the queue
		} while (websitePath.length > 0);

		// resolve all the parent nodes
		const parentNodes = await Promise.all(jobs);
		const parentNodesFilters = parentNodes.filter((e) => e !== undefined);

		// build every parent page
		for (const node of parentNodesFilters) {
			const pageRender = new PageRender(node.meta.template);
			const pageBuilder = new PageBuilder(node._id, pageRender);
			console.log(`building parent ${node.pageName}`);
			await pageBuilder.prepareTemplateData(templateSteps);
			pageBuilder.build(postProcessingSteps);
		}
	}

	async getPage(id) {
		const url = `${process.env.WATCHER_IP}/page?_id=${id}`;
		const options = {
			method: "GET",
		};
		const response = await fetch(url, options);
		const data = await response.json();
		return await data[0];
	}

	async prepareTemplateData(steps) {
		// https://github.com/RolandWarburton/knowledge/blob/master/programming/Javascript/Promise%20Chaining%20-%20Promises%20with%20Dependencies.md
		// Run each promise sequentially, ensure A finishes before B starts
		return steps
			.reduce((acc, curr, i, arr) => {
				return acc.then(async (curr) => {
					const step = arr[i];
					const data = await step.function(curr); // get the data
					curr[step.name] = data; // set the data in the current loop
					// console.log(`curr has been updated`);
					return curr;
				});
			}, this.templateData)
			.then((result) => {
				// now that we have ALL data, set the template to it!
				this._templateData = result;
				return result;
			});
	}

	// Be warned! this comes back as a promise
	get templateData() {
		return this._templateData;
	}

	// Because we defined a getter, we also need a setter
	set templateData(data) {
		this._templateData = data;
	}
}

// ! ##──── TESTING ───────────────────────────────────────────────────────────────────────────

// const blogPostRenderer = new PageRender("blogPost.ejs");

// // for now im just testing here with a random page ID in the database
// // const factory = new PageBuilder("5f3a7be2605ef400b4ba3de6") // notes/programming/github
// // const factory = new PageBuilder("5f3a7c67605ef400b4ba3df4") // notes/programming
// // const factory = new PageBuilder("5f39187aa50877014564db6e") // notes
// // const factory = new PageBuilder("5fd5783bf4500b001f1144a7", blogPostRenderer) // deleteMe/test
// const factory = new PageBuilder("5f83269f900fd25401b55f54", blogPostRenderer) // notes/linux/samba

// // TODO find a way to do this only once
// // Render the sass for this page
// // factory.renderSass()

// // define the steps we want to complete, these steps will add data to the pageBuilders templateData
// const templateSteps = [
// 	{name: "parent", function: (templateData) => getParent(templateData.websitePath)},
// 	{name: "siblings", function: (templateData) => getSiblings(templateData.parent.join("/"), 1)},
// 	{name: "children", function: (templateData) => getSiblings(templateData.websitePath.join("/"), 1)},
// 	{name: "neighbors", function: (templateData) => getNeighbors(templateData)},
// 	{name: "breadCrumbs", function: (templateData) => getBreadcrumbs(templateData)},
// 	{name: "dateData", function: (templateData) => getDateData(templateData)},
// 	{name: "history", function: async (templateData) => {
// 		const url = `${process.env.WATCHER_IP}/history/find/${templateData._id}`;
// 		return await (await fetch(url)).json();
// 	}},
// 	{name: "lastModified", function: (templateData) => getLastModified(templateData)},
// 	{name: "firstModified", function: (templateData) => getFirstModified(templateData)},
// 	{name: "styles", function: (templateData) => getHeaders(templateData.meta.template)},
// 	{name: "scripts", function: (templateData) => getScripts(templateData.meta.template)},
// 	{name: "templateDir", function: (templateData) => path.resolve(process.env.ROOT, "templates")},
// ]

// // ? The first way for getting the template set up
// const test = async () => {
// 	const a = await factory.prepareTemplateData(templateSteps)
// 	factory.build()
// 	// console.log(a.scripts)
// 	// console.log(a.styles)
// 	// console.log(JSON.stringify(a.lastModified))
// }
// test()

// // ? The other way for getting the template set up
// // factory.prepareTemplateData(templateSteps)
// // .then((td) => {
// // 	console.log("Finished preparing the template data")
// // 	console.log(td)
// // });

module.exports = PageBuilder;
