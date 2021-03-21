const fetch = require('node-fetch');

const treatUrl = (url) => {
	const tokenReplace = new RegExp(/TOKEN/);
	const result = url.replace(tokenReplace, process.env.GITHUB_TOKEN);
	return result;
};

const downloadMarkdown = async (url) => {
	url = decodeURI(url);

	// fetch the content in async. await the response immediately
	const response = await fetch(treatUrl(url));

	// TODO log failures here somewhere
	// ignore things that don't return
	if (response.status != 200) return ""

	// return the markdown text
	return await response.text();
};

module.exports = downloadMarkdown;