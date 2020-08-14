const debug = require("debug")("staticFolio:getSiblings");

/**
 * returns siblings in a mask in order they were inserted into the db
 * @param {Array} pages - pages array of json from
 * @param {String} mask - a mask to get siblings from
 * @param {Boolean} sort - Sort by alpha (default is date added to db)
 * @example getNeighbours([{...},{...}], "/page/mask")
 */
const genSiblings = (pages, mask, sort) => {
	let siblings = [];

	// check each page websitePath against the mask
	for (page of pages) {
		// debug(`CHECKING THE PAGE ${page.websitePath}`);
		const totalLength = page.websitePath.length;
		const lhs = page.websitePath.substring(0, mask.length);
		const rhs = page.websitePath.substring(mask.length + 1, totalLength);
		// add 1 to the rhs to avoid the "/"

		// debugging info
		// debug(`mask: ${mask}`);
		// debug(`lhs: ${lhs}`);
		// debug(`rhs: ${rhs}`);

		// get the first part of the path (or just the path if there are no children)
		const pathSibling = rhs.split("/")[0] || rhs;

		// if there is a sibling
		// and it doesnt already exist
		// and the lhs is matching the mask
		if (pathSibling && !siblings.includes(pathSibling) && lhs == mask) {
			siblings.push(pathSibling);
		}
	}
	// sort them alphabetically if {orderBy: "alpha"} is passed into options
	if (sort) {
		debug("sorting");
		siblings = siblings.sort();
	}

	debug(siblings);
	return siblings;
};

module.exports = genSiblings;
