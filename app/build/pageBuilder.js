const fs = require('fs');
const path = require('path');
const csso = require('csso');
const fetch = require('node-fetch');
require("dotenv").config()

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// import helper functions for the PageBuilder
const renderSass = require('./buildSteps/handleAssets/renderSass');

// import functions for the templateSteps array, which is given to the PageBuilder
// to populate the templateData object within the class
const getParent = require('./buildSteps/getParent');
const getSiblings = require('./buildSteps/getSiblings');
const getNeighbors = require('./buildSteps/getNeighbors');
const getBreadcrumbs = require('./buildSteps/getBreadcrumbs');
const getDateData = require('./buildSteps/getDateData');
const getLastModified = require('./buildSteps/getLastModified');


class PageBuilder {
	constructor(id) {
		if (!fs.existsSync("dist")) fs.mkdirSync("dist");
		this.id = id;
		this._templateData = this.getPage(id)
	}

	async getPage(id) {
		const url = `${process.env.WATCHER_IP}/page?_id=${id}`;
		const options = {
			method: 'GET',
		};
		const response = await fetch(url, options);
		const data = await response.json();
		return data[0];
	}

	async prepareTemplateData(steps) {
		// https://github.com/RolandWarburton/knowledge/blob/master/programming/Javascript/Promise%20Chaining%20-%20Promises%20with%20Dependencies.md
		return steps.reduce((acc, curr, i, arr) => {
			return acc.then(async (curr) => {
				const step = arr[i]
				const data = await step.function(curr) // get the data
				curr[step.name] = data // set the data in the current loop
				// console.log(`curr has been updated`);
				return curr
			});
		}, this.templateData)
		.then((result) => {
			// now that we have ALL data, set the template to it!
			this._templateData = result
			return result
		});
	}

	async renderSass() {return renderSass()}

	// Be warned! this comes back as a promise
	get templateData() {return this._templateData}

	// Because we defined a getter, we also need a setter
	set templateData(data) {this._templateData = data}

}

// ! ##──── TESTING ───────────────────────────────────────────────────────────────────────────

// for now im just testing here with a random page ID in the database
// const factory = new PageBuilder("5f3a7be2605ef400b4ba3de6") // notes/programming/github
// const factory = new PageBuilder("5f3a7c67605ef400b4ba3df4") // notes/programming
// const factory = new PageBuilder("5f39187aa50877014564db6e") // notes
const factory = new PageBuilder("5fd5783bf4500b001f1144a7") // deleteMe/test

// TODO find a way to do this only once
// Render the sass for this page
// factory.renderSass()

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
]


// ? The first way for getting the template set up
const test = async () => {
	const a = await factory.prepareTemplateData(templateSteps)
	console.log(a.lastModified)
	// console.log(JSON.stringify(a.lastModified))
}
test()


// ? The other way for getting the template set up
// factory.prepareTemplateData(templateSteps)
// .then((td) => {
// 	console.log("Finished preparing the template data")
// 	console.log(td)
// });

module.exports = PageBuilder;