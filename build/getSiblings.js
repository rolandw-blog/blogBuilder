const debug = require("debug")("v_staticFolio:getSiblings");
const error = require("debug")("v_staticFolio:error");

/**
 * returns siblings in a mask in order they were inserted into the db
 * @param {Array} pages - pages array of json from
 * @param {String} mask - a mask to get siblings from
 * @param {Boolean} sort - Sort by alpha (default is date added to db)
 * @example getNeighbours([{...},{...}], "/page/mask")
 */
const genSiblings = (pages, mask, sort) => {
	let siblings = [];
	error(`mask: ${mask}`);

	// check each page websitePath against the mask
	for (page of pages) {
		debug(`CHECKING THE PAGE ${page.websitePath}`);
		const totalLength = page.websitePath.length;
		const webPath = page.websitePath;
		const lhs = webPath.substring(0, mask.length);
		const rhs = webPath.substring(mask.length + 1, totalLength);
		// add 1 to the rhs to avoid the "/" at the split (i think, idk it just works™)

		// get the first part of the path
		let pathSibling;
		if (mask == "/") {
			// if you are on the root path "/"
			// then the sibling is the first item after "/"
			// we need to get it like this bc rhs has +1 on the mask which breaks it
			pathSibling = page.websitePath.split("/").filter(String)[0];
		} else {
			// else its not on the root path so the RHS[0] element is the sibling
			pathSibling = rhs.split("/")[0];
		}

		// if there is a sibling
		// and it doesnt already exist
		// and the lhs is matching the mask
		if (pathSibling && !siblings.includes(pathSibling) && lhs == mask) {
			siblings.push(pathSibling);
		}
	}
	// sort them alphabetically if (sort = true) is passed into options
	if (sort) {
		// debug("sorting");
		siblings = siblings.sort();
	}

	debug(`the siblings for ${mask} are:`);
	debug(siblings);
	return siblings;
};

module.exports = genSiblings;
