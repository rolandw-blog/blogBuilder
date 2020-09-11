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

/**
 * Return the commit data for the HEAD of this repo
 */
const getHeadCommit = async () => {
	// put the repo name here
	const repo = "rolandWarburton/staticFolio";
	const url = `https://api.github.com/repos/${repo}/commits/master`;

	debug("fetching head commit information");
	return fetch(url, { method: "get" })
		.then((res) => res.json())
		.then((json) => {
			debug(`fetched ${json.length} pages!`);
			return json;
		});
};

const buildPage = async (req, res) => {
	debug(`building page ${req.params.id}`);

	const head = await getHeadCommit();

	// fetch the page fresh from blog watcher
	debug("requesting the page", req.params.id);
	const body = {
		id: req.params.id,
	};
	const sig = signPayload(body);
	const headers = {
		Authorization: "Bearer 3imim8awgeq99ikbmg14lnqe0fu8",
		"x-payload-signature": sig,
	};

	let result = await fetch(
		`${process.env.WATCHER_IP}/build/${req.params.id}`,
		{ method: "post", headers: headers, body: new URLSearchParams(body) }
	);
	result = await result.json();
	page = result.page;

	if (!page) {
		return res.status(400).json({
			success: false,
			message: `failed to rebuild page. It likely didnt exist or it was hidden`,
		});
	}

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
		generateHtmlpage(outputMarkdown, { ...page, head: head }).then(() => {
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
