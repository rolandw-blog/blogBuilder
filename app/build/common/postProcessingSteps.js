const minifyHtml = require('html-minifier').minify;
const { emojify } = require("node-emoji")

const minifyOptions = {
	removeAttributeQuotes: true,
	collapseWhitespace: true,
	html5: true,
	minifyCSS: true,
	removeEmptyElements: true,
	removeComments: false,
	useShortDoctype: true,
};

// define the steps we want to complete, these steps will add data to the pageBuilders templateData
const postProcessingSteps = [
    (html) => minifyHtml(html, minifyOptions),
    (html) => emojify(html)
]

module.exports = postProcessingSteps