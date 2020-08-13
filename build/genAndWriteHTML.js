const generateAndWriteHTML = async function (templateData, filepath) {
	const minifyOptions = {
		removeAttributeQuotes: true,
		collapseWhitespace: true,
		html5: true,
		minifyCSS: true,
		removeEmptyElements: true,
		removeComments: true,
		useShortDoctype: true,
	};

	await generateHtmlPage(templateData, filepath)
		.then(({ html, templateData }) => {
			// Emojify it 💯
			html = emoji.emojify(html);
			debug(`emojified ${templateData.title}`);

			return html;
		})
		.then((html) => {
			// Minify it 🗜
			try {
				html = minify(html, minifyOptions);
			} catch (err) {
				return html;
			}
			debug(`minified ${templateData.title}`);
			return html;
		})
		.then((html) => {
			// Write it to dist 📤

			// Get some directories to create a write path

			// The base output directory
			const dist = path.resolve(process.env.ROOT, "dist");
			// The directory to place the writeDirectory
			const writeBaseDirectory = path.parse(filepath.path).dir;
			// The name of the directory to place the index.html in
			const writeDirectory = path
				.parse(filepath.path)
				.name.replace(/\s/g, "");

			// Builds the path for the index.html
			// For example if the output file in views/... was "Notes/topic.js"
			// ...then the fullWritePath will be ../Notes/topic/index.html
			// const fullWritePathToDirectory =
			const fullWritePathToDirectory =
				filepath.path != "index.js"
					? path.resolve(
							dist,
							writeBaseDirectory,
							writeDirectory,
							"index.html"
					  )
					: path.resolve(dist, "index.html");

			// write it to the dist folder
			mkdirp(path.parse(fullWritePathToDirectory).dir)
				.then(() => {
					write(fullWritePathToDirectory, html);
				})
				.catch((err) => console.log(err));

			debug(`wrote ${templateData.title}`);
			return filepath;
		})
		.catch((err) => console.log(err));
};

module.exports = generateAndWriteHTML;
