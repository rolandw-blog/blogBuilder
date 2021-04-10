const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readdirp = require("readdirp");
const sass = require("node-sass");
require("dotenv").config();
const { minify: minifyJS } = require("terser");
const { minify: minifyCSS } = require("csso");

// promisify read and write for easy use
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class AssetManager {
	constructor() {
		// this.cssSources = css;
		// this.javascriptSources = javascript;
		if (process.env.ROOT !== "" || process.env.ROOT !== undefined) {
			// ROOT env variable exists
			this._root = path.resolve(process.env.ROOT);
			this._src = path.resolve(process.env.ROOT, "src");
		} else {
			// ROOT env does not exist
			this._root = "/usr/src/app";
			this._src = "/usr/src/app/src";
		}
	}

	async renderJS() {
		const jsDir = path.resolve(this._src, "scripts");
		const outputPath = path.resolve(this._root, "dist");
		const js = [];

		for await (const entry of readdirp(jsDir)) {
			const fileProps = path.parse(entry.fullPath);
			if (fileProps.ext === ".js") {
				js.push(entry);
				continue;
			}
		}

		for (const entry of js) {
			const output = path.resolve(outputPath, entry.path);
			const js = readFile(entry.fullPath, { encoding: "utf8" });
			const minifiedJS = await minifyJS(await js);
			writeFile(output, minifiedJS.code, { encoding: "utf8" });
		}
	}

	async renderCSS() {
		const styleSheetDir = path.resolve(this._src, "styles");
		const outputPath = path.resolve(this._root, "dist");
		const scss = [];
		const css = [];

		for await (const entry of readdirp(styleSheetDir)) {
			const fileProps = path.parse(entry.fullPath);

			if (fileProps.ext === ".scss" && fileProps.base[0] !== "_") {
				scss.push(entry);
				continue;
			}

			if (fileProps.ext === ".css") {
				css.push(entry);
				continue;
			}
		}

		for (const entry of scss) {
			// Get the path to write to
			const output = path.resolve(outputPath, `${path.parse(entry.fullPath).name}.css`);
			this._renderSassFile(entry.fullPath, output, { quiet: true });
		}

		for (const entry of css) {
			const output = path.resolve(outputPath, entry.path);
			const css = readFile(entry.fullPath, { encoding: "utf8" });
			const minifiedCss = minifyCSS(await css).css;
			writeFile(output, minifiedCss, { encoding: "utf8" });
		}
	}

	// render out sass and write it to the dist folder
	// entry could equal: 'src/styles/styles.scss'
	// output could equal: 'dist/app.css'
	_renderSassFile(entry, output, options) {
		const { quiet } = options || false;
		sass.render(
			{
				file: path.resolve(process.env.ROOT, entry),
				outFile: path.resolve(process.env.ROOT, output),
				outputStyle: "compressed",
			},
			function (error, result) {
				if (!error) {
					fs.writeFile(path.resolve(process.env.ROOT, output), result.css, () => {
						if (!quiet) console.log(`rendered ${result.stats.entry}`);
						//success
					});
				} else {
					console.log(error);
				}
			}
		);
	}
}

module.exports = AssetManager;
