const path = require('path')
const listFilesInDir = require('../build/listFilesInDir')
const getRoutePositionInDir = require('../build/getRoutePositionInDir')
const getLinkToHtmlFilepath = require('../build/getLinkToHtmlFilepath');
const getFilepathNeighbours = require('../build/getFilepathNeighbours');
require('dotenv').config()

describe("Test listFilesInDir", () => {
	test("Check if a path exists", () => {
		expect(listFilesInDir("tests/testViews")).toEqual(["about.js", "index.js"]);
	});
});


describe("Test getRoutePositionInDir", () => {
	test("get Route Position In Dir", () => {
		expect(getRoutePositionInDir("tests/testViews", "about.js")).toEqual(0);
		expect(getRoutePositionInDir("tests/testViews", "index.js")).toEqual(1);
		expect(getRoutePositionInDir(path.resolve(process.env.ROOT, "src/views/notes"), "page3.js")).toEqual(0);
		expect(getRoutePositionInDir("/home/roland/Documents/Projects/folioSite/test2/src/views/notes", "page5.js")).toEqual(1);
	});
});


describe("Test getting html filepath", () => {
	test("Check if a path exists", () => {
		// expect(getLinkToHtmlFilepath("index.js", "about.js")).toEqual("/about");
		// expect(getLinkToHtmlFilepath("notes/page3.js", "page5.js")).toEqual("/notes/page5");
		expect(getLinkToHtmlFilepath("page5.js")).toEqual("/notes/page5");
	});
});


describe("Test getting html filepath", () => {
	test("Check if prev and next link works", () => {
		const pathData = {
			path: 'notes/page3.js',
			fullPath: '/home/roland/Documents/Projects/folioSite/test2/src/views/notes/page3.js',
			basename: 'page3.js'
		}

		const expected = {
			"next": {
				"filepath": "/notes/page5",
				"title": "page5.js"
			},
			"prev": {
				"filepath": "#",
				"title": undefined
			}
		}

		expect(getFilepathNeighbours(pathData)).toEqual(expected);
	});
});
