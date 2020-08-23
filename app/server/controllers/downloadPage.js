const fs = require("fs");
const debug = require("debug")("staticFolio:DownloadPageC");

// download some markdown from blog watcher
const downloadPage = (req, res) => {
	if (!req.body.markdown) {
		debug("no body attached");
		return res.status(400).json({
			success: false,
			message: "No body attached",
		});
	} else {
		debug("body attached");
	}

	debug("downloading page ", req.body.id);

	// write the file using the req.body.markdown as content
	if (!fs.existsSync("content")) fs.mkdirSync("content");

	fs.writeFile(`content/${req.body.id}.md`, req.body.markdown, (err) => {
		if (err) {
			debug("wrote file FAILED");
			return res.status(500).json({ success: false });
		} else {
			debug(`wrote file ${req.body.id}`);
			return res.status(200).json({ success: true });
		}
	});
};

module.exports = downloadPage;
