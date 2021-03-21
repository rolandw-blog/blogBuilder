const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const writeHtml = async (html, templateData) => {
	// get paths to write to
	const relativeWebPath = templateData.websitePath.join("/");
	const writePath = path.resolve(
		process.env.ROOT,
		"dist",
		relativeWebPath,
		"index.html"
	);
	const distPath = path.resolve(process.env.ROOT, "dist", relativeWebPath);

	// make the dir
	await mkdirp(path.resolve("dist", distPath)).catch((err) => {
		error(err);
		return false;
	});

	// write a html file here
	fs.writeFile(writePath, html, (err) => {
		if (err) console.log(err);
		// else console.log(writePath);
		return true;
	});
};

module.exports = writeHtml;
