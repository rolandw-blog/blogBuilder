const debug = require("debug")("staticFolio:getParent");

const getParent = (websitePath) => {
	// ! debug(`${websitePath} - getting the parent`);
	// turn it into an array
	const websitePathArray = websitePath.split("/");
	// remove the last element
	const parent = websitePathArray.splice(0, websitePathArray.length - 1);
	// join it back as a string
	const parentPath = parent.join("/");

	// ! debug(`${parentPath}`);
	return parentPath;
};

module.exports = getParent;
