const fetch = require("node-fetch");
const debug = require("debug")("staticFolio:DownloadPagesC");

// download ALL markdown from blog watcher
// ! Not using this right now
// ! Blog builder does not be able to request Blog watcher to refresh its content right now
const downloadPages = async (req, res) => {
	debug("downloading everything");
	await fetch(`http://10.10.10.12:8080/build`, {
		method: "GET",
	});
	return res.status(200).json({ success: true });
};

module.exports = downloadPages;
