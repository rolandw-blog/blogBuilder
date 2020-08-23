const scrollToHash = () => {
	const hash = window.location.hash
	const e = (hash) ? document.getElementById(window.location.hash.replace('#', '')) : undefined;
	if (e) {
		e.scrollIntoView({ block: "center" });
		e.style.transition = "background 0.25s ease-out"
		const oldColor = e.style.background

		// show the user the anchor link the url is pointing to
		e.style.background = "orange";

		// timeout the window then set the color back for the anchor
		window.setTimeout(() => {
			e.style.background = oldColor;
		}, 1500);
	}
}

const copyTextToClipboard = (text) => {
	// if the clipboard api is avaliable (ie running in https)
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text)
			.then(() => { console.log("copied to clipboard") })
			.catch(err => console.log(err))
	}
	else {
		console.warn("failed to clopy to clipboard (possibly not running on https. Roland fucked up!)")
	}
}

/** Pass a "copy" anchor element and it finds the nearest codeblock text and puts it into the clipboard
 * @param {HTML element} elem - HTML element of the copy button
 */
const copyCodeblockToClipboard = (elem) => {
	const codeWrapperElement = getNearestParentNodeOfClass(elem, ".code-wrapper");
	const codeBlockText = getNearestChildNodeOfClass(codeWrapperElement, ".codeblock-wrapper").innerText;
	copyTextToClipboard(codeBlockText);
}

/** 
 * @param {HTML element} elem - The element that you are on now
 * @param {*} targetElement - The nearest parent class element you want to find
 */
const getNearestParentNodeOfClass = (elem, targetElement) => {
	for (; elem && elem !== document; elem = elem.parentNode) {
		if (elem.matches(targetElement)) return elem;
	}
	return null;
}

/** Only looks at the directly attached children
 * @param {HTML element} elem - The element that you are on now
 * @param {*} targetElement - The nearest parent class element you want to find
 */
const getNearestChildNodeOfClass = (elem, targetElement) => {
	const children = elem.children;
	for (let i = 0; i < children.length; i++) {
		if (children[i].matches(targetElement)) return children[i];
	}
	return null;
}

const toggleToc = () => {
	// get the table of contents
	const nav = document.getElementById("table-of-contents")
	// if it exisits toggle between display block and none
	if (nav) {
		const block = (window.getComputedStyle(nav).display == "block") ? true : false;

		// if its in block (or unset) then hide it 
		if (block) {
			nav.style.animationName = "toc-slide-out";
			window.setTimeout(() => {
				nav.style.display = "none";
			}, 250);
		} else {
			nav.style.animationName = "toc-slide-in";
			nav.style.display = "block";
		}
	}
}

document.addEventListener("DOMContentLoaded", (e) => {
	scrollToHash()

	window.addEventListener('scroll', (e) => {
		const scrollPercentage = getScrollPercent();
		const gotoTopButton = document.getElementById("gotoTop");
		// if scrolled > 200px
		if (scrollPercentage > 500) {
			if (gotoTopButton) {
				gotoTopButton.style.display = "block";
			}
		} else {
			gotoTopButton.style.display = "none";
		}
	})
})

const togglePermalinkAnchor = (id, entering) => {
	const e = (id) ? document.getElementById(id + "-permalinkAnchor") : undefined
	if (e) {
		if (entering) e.style.opacity = 1; else e.style.opacity = 0;
	}
}

function getScrollPercent() {
	var h = document.documentElement,
		b = document.body,
		st = 'scrollTop',
		sh = 'scrollHeight';

	// return a percentage
	// return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;

	// return an absolute height
	return h[st]
}
