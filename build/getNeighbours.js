const getParent = require("./getParent");
const path = require("path");
/**
 *
 * @param {Array} siblings - Array of siblings
 * @param {JSON} page - database page
 * @example getNeighbours(['page1', 'page2'], {websitePath: '/path/pages'})
 */
const getNeighbours = (siblings, page) => {
	const parent = getParent(page.websitePath);
	const lastPathName = path.parse(page.websitePath).name;

	const l = siblings.length;
	const result = {};

	const nIndex = siblings.indexOf(lastPathName) + 1;
	const pIndex = siblings.indexOf(lastPathName) - 1;

	if (nIndex < l && nIndex >= 0) {
		result.next = `${parent}/${siblings[nIndex]}`;
	}

	if (pIndex < l && pIndex >= 0) {
		result.prev = `${parent}/${siblings[pIndex]}`;
	}

	return result;
};

module.exports = getNeighbours;
