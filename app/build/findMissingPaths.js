const debug = require("debug")("staticFolio:paths");
const debugv = require("debug")("v_staticFolio:paths");
const error = require("debug")("staticFolio:error");

const findMissingPaths = async (startPath, endPath, pages) => {
	debug(`checking path from "${endPath}" to "${startPath}"`);
	const missingPaths = [];
	// const websitePaths = [];
	const endPathArray = endPath.split("/").filter(String);
	const endPathLength = endPathArray.length;

	const websitePaths = pages.map((p) => {
		return p.websitePath;
	});
	for (let i = 0; i < endPathLength; i++) {
		// debug(endPathArray);
		const dest = endPathArray.join("/");
		endPathArray.pop();
		const exists = websitePaths.includes(`/${endPathArray.join("/")}`);
		const start = endPathArray.join("/");
		if (exists) {
			debugv(`found path from "/${dest}" to "/${start}"`);
		} else {
			error(`WARNING: no path found between "/${dest}" and "/${start}"`);
			missingPaths.push("/" + start);
		}
	}
	if (missingPaths.length == 0) {
		debug("no missing paths found");
	}
	return missingPaths;
};

module.exports = findMissingPaths;
