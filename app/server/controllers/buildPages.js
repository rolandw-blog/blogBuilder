const build = require("../../build");
const debug = require("debug")("staticFolio:BuildPages");

const buildPages = (req, res) => {
	build();
	return res.status(200).json({ success: true });
};

module.exports = buildPages;
