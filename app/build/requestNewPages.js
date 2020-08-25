const requestNewPage = require("./requestNewPage");
const debug = require("debug")("staticFolio:generatePaths");

/**
 * takes an array of paths and requests pages to be created for them
 * Generally used for requesting new pages to be created from missing paths
 * @param {Array} missingPaths
 * @example generatePaths(["/path/foo", "/path/bar"])
 * @returns array of newly generated pages
 */
const requestNewPages = async (missingPaths) => {
	const result = [];
	if (missingPaths.length == 0) {
		return null;
	}

	for (missingPath of missingPaths) {
		missingPath = missingPath.websitePath;
		// get the missing path as an array
		const pathArray = missingPath.split("/");

		// get the name
		const missingPageName = pathArray[pathArray.length - 1];

		// make a new page for submission
		// everything should be flat json for it to be encoded as x-www-form-urlencoded
		const newPage = {
			pageName: missingPageName,
			template: "menu.ejs",
			source: [],
			websitePath: missingPath,
		};

		// post the new page
		const createdPage = await requestNewPage(newPage);
		result.push(createdPage);
	}
	return result;
};

module.exports = requestNewPages;
