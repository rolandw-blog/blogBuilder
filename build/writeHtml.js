const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const log = require("debug")("v_staticFolio:log");
const debug = require("debug")("v_staticFolio:writeHtml");

const writeHtml = async (html, templateData) => {
	// get paths to write to
	const relativeWebPath = templateData.websitePath.substring(1);
	const writePath = path.resolve("dist", relativeWebPath, "index.html");
	const distpath = path.resolve("dist", relativeWebPath);
	log("writePath", path.relative(".", writePath));
	log("distpath", path.relative(".", distpath));

	// make the dir
	await mkdirp(path.resolve("dist", distpath)).catch((err) => {
		error(err);
	});

	// write a html file here
	fs.writeFile(writePath, html, (err) => {
		if (err) error(err);
		else debug(`Wrote:\t${templateData.websitePath}`);
	});
};

module.exports = writeHtml;
