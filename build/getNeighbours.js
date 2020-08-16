const getParent = require("./getParent");
const path = require("path");
/**
 *
 * @param {Array} siblings - Array of siblings
 * @param {JSON} page - database page
 * @example getNeighbours(['page1', 'page2'], {websitePath: '/path/pages'})
 */
const getNeighbours = (siblings, page) => {
	// get the parent of this page to find its index
	const parent = getParent(page.websitePath);
	// get the name (last item in the websitePath)
	const lastPathName = path.parse(page.websitePath).name;

	const l = siblings.length;
	const result = { prev: {}, next: {} };

	const nIndex = siblings.indexOf(lastPathName) + 1;
	const pIndex = siblings.indexOf(lastPathName) - 1;

	if (nIndex < l && nIndex >= 0) {
		result.next.path = `${parent}/${siblings[nIndex]}`;
		result.next.name = siblings[nIndex];
	}

	if (pIndex < l && pIndex >= 0) {
		result.prev.path = `${parent}/${siblings[pIndex]}`;
		result.prev.name = siblings[pIndex];
	}

	return result;
};

module.exports = getNeighbours;
