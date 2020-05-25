const path = require('path')
require('dotenv').config()
const buildDir = path.resolve(process.env.ROOT, "build");
const viewsDir = path.resolve(process.env.ROOT, "tests/testViews");

const listFilesInDir = require(path.resolve(buildDir, "listFilesInDir.js"));
const getRoutePositionInDir = require(path.resolve(buildDir, "getRoutePositionInDir.js"));
const getLinkToHtmlFilepath = require(path.resolve(buildDir, "getLinkToHtmlFilepath.js"));
const getFilepathNeighbours = require(path.resolve(buildDir, "getFilepathNeighbours.js"));

describe("Test getting fullwritepath", () => {
	test("Check if you can get the write dir", () => {
		const results = []

		const filepaths = [{
			"path": 'about.js',
			"fullPath": path.resolve(viewsDir, "about.js"),
			"basename": 'about.js'
		},
		{
			"path": 'notes/page3.js',
			"fullPath": path.resolve(viewsDir, "page3.js"),
			"basename": 'about.js'
		},
		{
			"path": 'index.js',
			"fullPath": path.resolve(viewsDir, "index.js"),
			"basename": 'index.js'
		}
		]

		for (filepath of filepaths) {
			const dist = path.resolve(process.env.ROOT, "dist")
			// The directory to place the writeDirectory
			const writeBaseDirectory = path.parse(filepath.path).dir
			// The name of the directory to place the index.html in
			const writeDirectory = path.parse(filepath.path).name.replace(/\s/g, '')

			// Builds the path for the index.html
			// For example if the output file in views/... was "Notes/topic.js"
			// ...then the fullWritePath will be ../Notes/topic/index.html
			// const fullWritePathToDirectory = 
			const fullWritePathToDirectory = (filepath.path != "index.js") ?
				path.resolve(dist, writeBaseDirectory, writeDirectory, "index.html")
				: path.resolve(dist, "index.html");

			// write it to the dist folder
			results.push(fullWritePathToDirectory)
		}

		expect(results[0]).toEqual("/home/roland/Documents/Projects/staticFolio/dist/about/index.html");
		expect(results[1]).toEqual("/home/roland/Documents/Projects/staticFolio/dist/notes/page3/index.html");
		expect(results[2]).toEqual("/home/roland/Documents/Projects/staticFolio/dist/index.html");


	});
});
