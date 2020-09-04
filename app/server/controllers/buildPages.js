const build = require("../../build");
const debug = require("debug")("staticFolio:BuildPages_C");

const buildPages = (req, res) => {
	debug("buildpages endpoint hit")
	build();
	return res.status(200).json({ success: true });
};

module.exports = buildPages;
