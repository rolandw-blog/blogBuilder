const debug = require("debug")("build:findPage");

// ! DEPRICATED. Should use a database query instead of this 💩
const findPage = (pages, key, value) => {
	// use find() to get the first page that matches the arguments websitePath by checking every page passed in
	const page = pages.find((potentialPage, i) => {
		// debug(`if ${potentialPage[key]} is ${value}`);
		if (potentialPage[key] == value) {
			return potentialPage;
		}
	});
	return page;
};

module.exports = findPage;
