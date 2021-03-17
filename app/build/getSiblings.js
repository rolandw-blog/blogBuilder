const debug = require("debug")("build:getSiblings");
const error = require("debug")("v_build:error");
const signPayload = require("./signPayload");
const fetch = require("node-fetch");
const path = require("path");

// return all the pages from the mask onwards
const getPages = async (websitePath) => {
	const body = {
		websitePath: websitePath,
		uuid: "some random uuid here",
	};

	const sig = signPayload(body);
	const headers = {
		Authorization: "Bearer 3imim8awgeq99ikbmg14lnqe0fu8",
		"x-payload-signature": sig,
	};

	const url = `${
		process.env.WATCHER_IP
	}/pages/websitePath/${websitePath.replace(/\//g, "%2F")}`;
	const request = await fetch(url, {
		method: "get",
		headers: headers,
	});
	const response = await request;
	const json = response.json();
	return json;
};

/**
 * returns siblings in a mask in order they were inserted into the db
 * @param {Array} pages - pages array of json from
 * @param {String} mask - a mask to get siblings from
 * @param {Boolean} sort - Sort by alpha (default is date added to db)
 * @example getneighbors([{...},{...}], "/page/mask")
 */
const genSiblings = async (mask, sort) => {
	// debug("getting pages");
	const pages = await getPages(mask);
	let siblings = [];
	const maskArray = mask.split("/").filter(String);

	// check each page websitePath against the mask
	for (page of pages.data) {
		// split the websitePath into an array
		const pathArray = page.websitePath.split("/").filter(String);

		// get the LHS and RHS of the website path array
		const maskedArrayLeft = pathArray.splice(0, maskArray.length);
		const maskedArrayRight = pathArray;

		// get the mask of this page using the LHS array
		const pathsiblingMask = "/" + maskedArrayLeft.join("/");

		// get the potential sibling using the RHS array
		const pathSibling = maskedArrayRight.join("/");

		// const matches = (sibling, i) => sibling == siblings[i];
		// check that ${pathsiblingMask} matches ${mask}
		if (pathsiblingMask == mask) {
			// now we need to check that ${pathSibling} is the last bit of ${page.websitePath}
			if (maskedArrayRight[maskedArrayRight.length - 1] == pathSibling) {
				// add it to the result
				siblings.push(page);
			}
		}
	}

	// Great help from c-sharpcorner on this
	// https://www.c-sharpcorner.com/UploadFile/fc34aa/sort-json-object-array-based-on-a-key-attribute-in-javascrip/
	const GetSortOrder = (prop) => {
		return (a, b) => {
			if (a[prop] > b[prop]) {
				return true;
			} else if (a[prop] < b[prop]) {
				return false;
			}
			return 0;
		};
	};

	// sort the siblings alphabetically if (sort = true) is passed into options
	if (sort) {
		// debug("sorting");
		siblings = siblings.sort(GetSortOrder("pageName"));
	}

	// debug(`the siblings for ${mask} are:`);
	return siblings;
};

module.exports = genSiblings;
