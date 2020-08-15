const debug = require("debug")("staticFolio:paths");
const error = require("debug")("staticFolio:error");

const findMissingPaths = async (startPath, endPath, pages) => {
	debug(`checking path from ${endPath} to ${startPath}`);
	const missingPaths = [];
	// const websitePaths = [];
	const endPathArray = endPath.split("/").filter(String);
	const endPathLength = endPathArray.length;

	const websitePaths = pages.map((p) => {
		return p.websitePath;
	});
	// // debug(websitePaths);
	for (let i = 0; i < endPathLength; i++) {
		// debug(endPathArray);
		const dest = endPathArray.join("/");
		endPathArray.pop();
		const exists = websitePaths.includes(`/${endPathArray.join("/")}`);
		const start = endPathArray.join("/");
		if (exists) {
			debug(`found path from "/${dest}" to "/${start}"`);
		} else {
			error(`WARNING: no path found between "/${dest}" and "/${start}"`);
			// // get the parent of dest (the missing path)
			// const temp = endPathArray;
			// temp.pop();
			// // put it in the list of missing paths
			// debug("added missing path");
			missingPaths.push("/" + start);
		}
	}
	return missingPaths;
};

module.exports = findMissingPaths;
