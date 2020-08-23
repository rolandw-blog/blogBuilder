const fs = require("fs");
const path = require("path");
const debug = require("debug")("staticFolio:deletePage");

const deletePage = async (websitePath) => {
	const relativeWebPath = websitePath.substring(1);
	const deletePath = path.resolve("dist", relativeWebPath, "index.html");

	return fs.unlink(deletePath, () => {
		debug(`removed ${deletePath}`);
	});
};

module.exports = deletePage;
