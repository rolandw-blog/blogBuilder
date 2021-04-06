const fetch = require("node-fetch");
const path = require("path");

// import functions for the templateSteps array, which is given to the PageBuilder
// to populate the templateData object within the class
const getParent = require('../../build/buildSteps/getParent');
const getSiblings = require('../../build/buildSteps/getSiblings');
const getNeighbors = require('../../build/buildSteps/getNeighbors');
const getBreadcrumbs = require('../../build/buildSteps/getBreadcrumbs');
const getDateData = require('../../build/buildSteps/getDateData');
const {getLastModified, getFirstModified} = require('../../build/buildSteps/getModified');
const { getScripts, getHeaders } = require("../../build/buildSteps/getHeadersAndScripts")

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
    {name: "templateDir", function: (templateData) => path.resolve(process.env.ROOT, "templates")},
]

module.exports = templateSteps