const debug = require("debug")("staticFolio:paths");
const error = require("debug")("staticFolio:error");

const findMissingPath = (startPath, endPath, pages) => {
	debug(`checking path from ${startPath} to ${endPath} is valid`);
	const pathTracker = [];
	const websitePaths = [];
	const endPathArray = endPath.split("/").filter(String);
	const endPathLength = endPathArray.length;

	for (page of pages) {
		websitePaths.push(page.websitePath);
	}
	// debug(websitePaths);

	for (let i = 0; i < endPathLength; i++) {
		// debug(endPathArray);
		const dest = endPathArray.join("/");
		endPathArray.pop();
		const exists = websitePaths.includes(`/${endPathArray.join("/")}`);
		const start = endPathArray.join("/");

		if (exists) {
			debug(`found path from "/${start}" to "/${dest}"`);
		} else {
			error(`WARNING: no path found between "/${start}" and "/${dest}"`);
			break;
		}
	}
	// for (i in endPathLength) {
	// 	endPathArray.pop();
	// 	debug(endPathArray);
	// }
	// debug("checking path", pathSegment);
	// clone the full path and
	// const thisPathArray = endPathArray;
	// debug(thisPathArray);
	// thisPathArray.pop();
	// debug(thisPathArray);
	// for (page of pages) {
	// 	if (page.websitePath)
	// }
	// }
	//
	// const startPathArray = startPath.split("/").filter(String);
	// const endPathArray = endPath.split("/").filter(String);
	// debug(startPathArray);
	// debug(endPathArray);
};

module.exports = findMissingPath;
