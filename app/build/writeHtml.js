const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const debug = require("debug")("staticFolio:writeHtml");
const error = require("debug")("staticFolio:writeHtmlError");

const writeHtml = async (html, templateData) => {
	// get paths to write to
	const relativeWebPath = templateData.websitePath.substring(1);
	const writePath = path.resolve(
		process.env.ROOT,
		"dist",
		relativeWebPath,
		"index.html"
	);
	const distpath = path.resolve(process.env.ROOT, "dist", relativeWebPath);
	// debug("writePath", path.relative(".", writePath));
	// debug("distpath", path.relative(".", distpath));

	// make the dir
	await mkdirp(path.resolve("dist", distpath)).catch((err) => {
		error(err);
		return false;
	});

	// write a html file here
	fs.writeFile(writePath, html, (err) => {
		if (err) error(err);
		else debug(writePath);
		// else debug(`Wrote:\t${templateData.websitePath}`);
		return true;
	});
};

module.exports = writeHtml;
