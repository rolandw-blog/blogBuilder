const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const util = require("util");
const signPayload = require("../../build/signPayload");
const renderSass = require("../../build/renderSass");
const generateHtmlpage = require("../../build/generateHtmlPage");
const deletePage = require("../../build/deletePage");
const debug = require("debug")("staticFolio:BuildPageC");

const read = util.promisify(fs.readFile);

const buildPage = async (req, res) => {
	debug(`building page ${req.params.id}`);

	// get all the pages data
	debug("getting all the pages");
	const pagesReq = await fetch(
		`${process.env.PROTOCOL}://${process.env.WATCHER_IP}/pages`
	);
	const pages = await pagesReq.json();

	// try and download the page from blog watcher
	const body = { id: req.params.id };

	// fetch the page fresh from blog watcher
	debug("requesting the page", req.params.id);
	let result = await fetch(
		`${process.env.PROTOCOL}://${process.env.WATCHER_IP}/build/${req.params.id}`
	);
	result = await result.json();
	page = result.page;

	const copy = util.promisify(fs.copyFile);

	// copy js to dist
	await copy(
		path.resolve(process.env.ROOT, "scripts/gist.js"),
		path.resolve(process.env.ROOT, "dist/gist.js")
	);
	await copy(
		path.resolve(process.env.ROOT, "scripts/index.js"),
		path.resolve(process.env.ROOT, "dist/index.js")
	);

	// copy media to dist
	debug("copying stuff to dist");
	const mediaSrcPath = path.resolve(process.env.ROOT, "src/media");
	const mediaDistPath = path.resolve(process.env.ROOT, "dist/media");

	if (!fs.existsSync(mediaDistPath)) fs.mkdirSync(mediaDistPath);
	for (f of fs.readdirSync(mediaSrcPath)) {
		copy(`${mediaSrcPath}/${f}`, `${mediaDistPath}/${f}`);
	}

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
