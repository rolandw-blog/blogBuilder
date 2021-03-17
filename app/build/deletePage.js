const fs = require("fs");
const path = require("path");
const debug = require("debug")("build:deletePage");

const deletePage = async (websitePath) => {
	const relativeWebPath = websitePath.substring(1);
	const deletePath = path.resolve("dist", relativeWebPath, "index.html");

	try {
		return fs.unlink(deletePath, () => {
			debug(`removed ${deletePath}`);
		});
	} catch (err) {
		debug(err);
		return false;
	}
};

module.exports = deletePage;
