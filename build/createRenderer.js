const marked = require("marked");
const hljs = require("highlight.js");
const debug = require("debug")("staticFolio:marked");

// PURPOSE
//
/**
 *
 * @param {String} text
 * @param {Number} level
 */
const renderHeading = (text, level) => {
	let escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
	// sanitize the link anchors
	escapedText = escapedText.replace(/"|'|`/g, "");

	return `
	<strong onmouseover="togglePermalinkAnchor('${escapedText}', true);" onmouseleave="togglePermalinkAnchor('${escapedText}', false)">
		<h${level} id="${escapedText}">
			${text}
			<a 
				name="${escapedText}" 
				id="${escapedText}-permalinkAnchor" 
				onClick="copyTextToClipboard(document.location.href);" 
				class="gistShareAnchor" 
				title="Permalink to this headline"
				href="#${escapedText}"
			>
				#
			</a>	
		</h${level}>
	</strong>`;
};

// PURPOSE
//
/**
 *
 * @param {String} header
 * @param {String} body
 */
const renderTable = (header, body) => {
	return `
	<div style="overflow-x: scroll;">
		<table>
			<thead>${header}</thead>
			${body}
		</table>
	</div>`;
};

// PURPOSE
//
/**
 *
 * @param {String} href
 * @param {String} title
 * @param {String} text
 */
const renderImage = (href, title, text) => {
	return `
	<div class="markdown-image-wrapper">
		<img src="${href}" alt=${title}>
	</div>
	`;
};

const renderPre = (infoString, code, codeSpans, isOutput) => {
	return `
	<div class="codeblock-wrapper language-${infostring}">
<pre><code class="language-${infostring}">${
		isOutput ? code : codeSpans
	}</code><pre>
	`;
};

// PURPOSE
//
/**
 *
 * @param {String} code
 * @param {String} infostring
 * @param {Boolean} escaped
 */
const renderCode = (code, infostring, escaped) => {
	const codeSpans = hljs.highlightAuto(code).value;
	const isOutput = infostring == "output" ? true : false;
	const copyButton = `<span class="codeblock-copy-label" onClick="copyCodeblockToClipboard(this)"><a class="darkHyperLink">Copy</a></span>`;
	const outputLabel = `<div class='codeblock-output-label'>Output</div>`;

	let output = `
		<div class="code-wrapper">
			${infostring == "output" ? outputLabel : copyButton}
			<div class="codeblock-wrapper language-${infostring}">
				<pre>
					<code class="language-${infostring}">
						${isOutput ? code : codeSpans}
					</code>
				<pre>
			</div>
		</div>
	`;

	// replace 1 new line, followed by 1+ tabs with blank space (i.e remove it)
	return output.replace(/\n\t+/g, "");
};

/**
 *
 * @param {String} href
 * @param {String} title
 * @param {String} text
 */
const renderLink = (href, title, text) => {
	return `
	<a href="${href}" class="darkHyperLink"><strong>${text}</strong></a>
	`;
};

const createRenderer = () => {
	const renderer = new marked.Renderer();
	renderer.heading = (text, level) => {
		return renderHeading(text, level);
	};

	// return tables in a wrapper
	renderer.table = (header, body) => {
		return renderTable(header, body);
	};

	// return images in a wrapper
	renderer.image = (href, title, text) => {
		return renderImage(href, title, text);
	};

	// render code correctly
	renderer.code = (code, infostring, escaped) => {
		return renderCode(code, infostring, escaped);
	};

	renderer.link = (href, title, text) => {
		return renderLink(href, title, text);
	};

	return renderer;
};

module.exports = createRenderer;
