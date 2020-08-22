const fetch = require("node-fetch");
const fs = require("fs");
const util = require("util");
const signPayload = require("../../build/signPayload");
const renderSass = require("../../build/renderSass");
const generateHtmlpage = require("../../build/generateHtmlPage");
const debug = require("debug")("staticFolio:BuildPageC");

const read = util.promisify(fs.readFile);

const buildPage = async (req, res) => {
	debug(`building page ${req.params.id}`);

	// get all the pages data
	debug("getting all the pages");
	const pagesReq = await fetch(`http://10.10.10.12:8080/pages`);
	const pages = await pagesReq.json();

	// try and download the page from blog watcher
	const body = { id: req.params.id };
	const sig = signPayload(body);

	// fetch the page fresh from blog watcher
	debug("requesting the page", req.params.id);
	let result = await fetch(`http://10.10.10.12:8080/build/${req.params.id}`, {
		method: "GET",
		headers: { "x-payload-signature": sig },
	});
	result = await result.json();
	page = result.page;

	// ! this is a temp holdover from build() all pages
	// TODO seperate this into its own function or something
	renderSass("src/styles/dark.scss", "dist/dark.css");
	renderSass("src/styles/light.scss", "dist/light.css");
	renderSass("src/styles/blue.scss", "dist/blue.css");
	renderSass("src/styles/gist.scss", "dist/gist.css");
	renderSass("src/styles/home.scss", "dist/home.css");
	renderSass("src/styles/menu.scss", "dist/menu.css");

	debug("reading the file", page._id);
	let outputMarkdown = await read(`content/${page._id}.md`, "utf8");

	// now try and build it and write it to dist
	try {
		debug("trying to generate html");
		generateHtmlpage(outputMarkdown, pages, { ...page }).then(() => {
			debug(`finished building page ${page._id}.`);
		});

		return res.status(200).json({ success: true });
	} catch (err) {
		debug(`error building page ${page._id}! ${err}`);
		return res.status(500).json({
			success: false,
			message: `failed to rebuild single page ${page._id}`,
		});
	}
};

module.exports = buildPage;
