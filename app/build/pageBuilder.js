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
		const jobs = [];

		for(const step of steps) {

			const templateData = await this._templateData;

			// push a job to the stack
			jobs.push(new Promise((res) => {
				const stepName = step.name; // extract the steps name
				const data = step.function(templateData); // run the step
				this._templateData[stepName] = data; // update the template data
				console.log("completed job:", stepName)
				res() // call resolve to let promise.all know we are done with this task
			}))
		}

		// make sure all our template building jobs have completed
		return Promise.all(jobs).then(() => {console.log("done!")});
	}

	async renderSass() {return renderSass()}

	// Be warned! this comes back as a promise
	get templateData() {return this._templateData}

	// Because we defined a getter, we also need a setter
	set templateData(data) {this._templateData = data}

}

// for now im just testing here with a random page ID in the database
const factory = new PageBuilder("5f83269f900fd25401b55f54")

// TODO find a way to do this only once
// Render the sass for this page
// factory.renderSass()

// define the steps we want to complete, these steps will add data to the pageBuilders templateData
const templateSteps = [
	{name: "parent", function: (templateData) => getParent(templateData.websitePath)},
	{name: "siblings", function: (templateData) => getSiblings(templateData.websitePath.join("/"))},
]

factory.prepareTemplateData(templateSteps).then(() => {
	console.log("Finished preparing the template data")
});

module.exports = PageBuilder;