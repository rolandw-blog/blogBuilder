
// just return a new array with the last element removed
const getParent = (websitePath) => {
	const temp = [...websitePath];
	temp.pop();
	return temp;
};

module.exports = getParent;
