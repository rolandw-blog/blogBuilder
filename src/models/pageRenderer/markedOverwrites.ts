// eslint-disable-next-line node/no-unpublished-import
import hljs from "highlight.js";
// eslint-disable-next-line node/no-unpublished-import
import { stripIndent } from "common-tags";
import marked from "marked";

// PURPOSE
//
/**
 *
 * @param {String} text
 * @param {Number} level
 */
const renderHeading = (text: string, level: number) => {
	let escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
	// sanitize the link anchors
	escapedText = escapedText.replace(/"|'|`/g, "");

	return stripIndent`
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
const renderTable = (header: string, body: string) => {
	return stripIndent`
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
const renderImage = (href: string, title: string) => {
	return stripIndent`
	<div class="markdown-image-wrapper">
		<img src="${href}" alt=${title}>
	</div>
	`;
};

// const renderPre = (infostring: string, code: string, codeSpans: string, isOutput: boolean) => {
// 	return `
// 	<div class="codeblock-wrapper language-${infostring}">
// <pre><code class="language-${infostring}">${isOutput ? code : codeSpans}</code><pre>
// 	`;
// };

// PURPOSE
//
/**
 *
 * @param {String} code
 * @param {String} infostring
 * @param {Boolean} escaped
 */
const renderCode = (code: string, language: string) => {
	let codeSpans = "";
	if (language === "none") {
		codeSpans = code;
	} else {
		codeSpans = hljs.highlightAuto(code).value;
	}
	const isOutput = language == "output" ? true : false;
	const copyButton = stripIndent`<span class="codeblock-label codeblock-copy-label" onClick="copyCodeblockToClipboard(this)"><a class="darkHyperLink">Copy</a></span>`;
	const outputLabel = stripIndent`<div class='codeblock-label codeblock-output-label'>Output</div>`;

	const output = stripIndent`
		<div class="code-wrapper ${language === "output" && "is-output"}">
			${language === "output" ? outputLabel : copyButton}
			<div class="codeblock-wrapper language-${language}">
				<pre>
					<code class="language-${language}">
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
const renderLink = (href: string, _title: string, text: string) => {
	return stripIndent`
	<a href="${href}" class="darkHyperLink"><strong>${text}</strong></a>
	`;
};

const createRenderer = (): marked.Renderer => {
	const renderer = new marked.Renderer();
	renderer.heading = (text, level) => {
		return renderHeading(text, level);
	};

	// return tables in a wrapper
	renderer.table = (header, body) => {
		return renderTable(header, body);
	};

	// return images in a wrapper
	renderer.image = (href, title) => {
		return renderImage(href || "/404.png", title || "");
	};

	// render code correctly
	renderer.code = (code, language) => {
		return renderCode(code, language || "none");
	};

	renderer.link = (href, title, text) => {
		return renderLink(href || "#", title || "", text);
	};

	return renderer;
};

export default createRenderer;
