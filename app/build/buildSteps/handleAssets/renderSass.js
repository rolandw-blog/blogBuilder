const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readdirp = require("readdirp");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const renderSass = async () => {
	const styleSheetDir = process.env.ROOT
		? path.resolve(process.env.ROOT, "src/styles")
		: path.resolve("/usr/src/app/src/styles");
	const outputPath = path.resolve(process.env.DIST || "/usr/src/app/dist");
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
		const output = path.resolve(outputPath, `${path.parse(entry.fullPath).name}.css`);
		// console.log(entry)
		renderSass(entry.fullPath, output, { quiet: true });
	}

	for (const entry of css) {
		const output = path.resolve(outputPath, entry.path);
		const css = readFile(entry.fullPath, { encoding: "utf8" });
		const minifiedCss = csso.minify(await css).css;
		writeFile(output, minifiedCss, { encoding: "utf8" });
	}
};

module.exports = renderSass;
