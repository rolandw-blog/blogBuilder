const getNeighbors = (templateData) => {
	const result = { prev: undefined, next: undefined };
	const {siblings, _id} = templateData;

	// get the location of the actual page within its siblings
	const currPageIndexInSiblings = siblings.findIndex((s) => {
		if (s._id === _id) return s;
	})

	// if the location in its siblings + 1 is in range, then set it
	if (currPageIndexInSiblings >= 1) result.prev = siblings[currPageIndexInSiblings - 1];

	// if the location in its siblings + 1 is in range, then set it
	if (currPageIndexInSiblings < siblings.length - 1) result.next = siblings[currPageIndexInSiblings + 1];

	return result;
};

module.exports = getNeighbors;
