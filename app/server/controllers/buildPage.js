const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const util = require("util");
const renderSass = require("../../build/buildSteps/handleAssets/renderSassFile");
const generateHtmlPage = require("../../build/generateHtmlPage");
const getHeadCommit = require("../../build/buildSteps/getHeadCommit");
const { minify } = require("terser");
const debug = require("debug")("build:BuildPageC");

const read = util.promisify(fs.readFile);
const copy = util.promisify(fs.copyFile);

/**
 * @param {String} id - ID of the page
 */
const refreshPage = async (id) => {
	// fetch the page fresh from blog watcher
	debug("requesting the page", id);
	const url = `${process.env.WATCHER_IP}/page/?_id=${id}`;
	let result = await fetch(url, {
		method: "get",
	});

	if (result.status != 200) debug(result);

	const page = await result.json();
	return page;
};

// do some processing on the url
// Sub in the github token to use my private repos
/**
 *
 * @param {String} url
 */
const treatUrl = (url) => {
	const tokenReplace = new RegExp(/TOKEN/);
	const result = url.replace(tokenReplace, process.env.GITHUB_TOKEN);
	return result;
};

/**
 * Downloads raw markdown from a url (usually github)
 * @param {String} url
 */
const downloadMarkdown = async (url) => {
	debug("downloading markdown...");
	url = decodeURI(url);
	// debug(url);

	// fetch the content in async. await the response immediately
	const response = await fetch(treatUrl(url));

	if (response.status != 200) {
		debug(`Error fetching file: ${response.status}`);
	}

	// return the markdown text
	return await response.text();
};

const preSetup = async (page) => {
	// TODO put this in a separate function
	debug("writing scripts");
	let index = fs.readFileSync(
		path.resolve(process.env.ROOT, "scripts/index.js"),
		"utf-8"
	);
	index = await minify(index);
	fs.writeFileSync(
		path.resolve(process.env.ROOT, "dist/index.js"),
		index.code,
		{
			encoding: "utf8",
			flag: "w",
		}
	);

	let gist = fs.readFileSync(
		path.resolve(process.env.ROOT, "scripts/gist.js"),
		"utf-8"
	);
	gist = await minify(gist);
	fs.writeFileSync(
		path.resolve(process.env.ROOT, "dist/gist.js"),
		gist.code,
		{
			encoding: "utf8",
			flag: "w",
		}
	);

	// copy media to dist
	debug("copying media to dist");
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
};

const buildPage = async (req, res) => {
	debug(`building page ${req.params.id}`);

	// Get the page
	let page = await refreshPage(req.params.id);
	debug(page);

	if (!page) {
		return res.status(400).json({
			success: false,
			message: `failed to rebuild page. It likely didn't exist or it was hidden`,
		});
	}

	preSetup(page);

	debug("reading the file", page._id);
	let markdownOutput = "";

	debug(`downloading sources for "${page.pageName}"`);
	for (let i = 0; i < page.source.length; i++) {
		const pageSource = page.source[i];

		// download markdown stuff if its remote or read it
		const markdown = await downloadMarkdown(pageSource.url);
		markdownOutput += markdown;
	}

	// now try and build it and write it to dist
	try {
		const head = await getHeadCommit();
		debug("trying to generate html");
		generateHtmlPage(markdownOutput, { ...page, head: head }).then(() => {
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
