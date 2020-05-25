const path = require('path')
require('dotenv').config()
const buildDir = path.resolve(process.env.ROOT, "build");
const viewsDir = path.resolve(process.env.ROOT, "tests/testViews");

const listFilesInDir = require(path.resolve(buildDir, "listFilesInDir.js"));
const getRoutePositionInDir = require(path.resolve(buildDir, "getRoutePositionInDir.js"));
const getLinkToHtmlFilepath = require(path.resolve(buildDir, "getLinkToHtmlFilepath.js"));
const getFilepathNeighbours = require(path.resolve(buildDir, "getFilepathNeighbours.js"));

describe("Test listFilesInDir", () => {
	test("Check if a path exists", () => {
		expect(listFilesInDir("tests/testViews")).toEqual(["about.js", "index.js"]);
		expect(listFilesInDir(viewsDir)).toEqual(["about.js", "index.js"]);
	});
});


describe("Test getRoutePositionInDir", () => {
	test("get Route Position In Dir", () => {
		expect(getRoutePositionInDir(viewsDir, "about.js")).toEqual(0);
		expect(getRoutePositionInDir(viewsDir, "index.js")).toEqual(1);
		expect(getRoutePositionInDir(path.resolve(viewsDir, "notes"), "page3.js")).toEqual(0);
	});
});


describe("Test getting html filepath", () => {
	test("Check if a path exists", () => {
		// getLinkToHtmlFilepath EXPECTS a readirp filepath which is a json object that contains a path key that it can extract
		expect(getLinkToHtmlFilepath({path: "notes/page3.js"}, "page3")).toEqual("/notes/page3");

		// If you pass it the index it returns the root with a # to stop page reloads
		expect(getLinkToHtmlFilepath({path: ""}, "index.js")).toEqual("/#");

		// when you pass it the index and you arent looking for index.js then return /filename
		expect(getLinkToHtmlFilepath({path: ""}, "about.js")).toEqual("/about");
	});
});


describe("Test getting html filepath", () => {
	test("Check if prev and next link works", () => {
		const pathData = {
			path: 'notes/page3.js',
			fullPath: path.resolve(viewsDir, "notes/page3.js"),
			basename: 'page3.js'
		}

		const expected = {
			"next": {
				"filepath": "/notes/page4",
				"title": "page4"
			},
			"prev": {
				"filepath": "#",
				"title": "-"
			}
		}

		expect(getFilepathNeighbours(pathData)).toEqual(expected);
	});
});
