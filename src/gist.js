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
			console.log("test")
		}, 1500);
	}
}

const copyUrlToClipboard = (id) => {
	const e = (id) ? document.getElementById(id) : undefined
	// if the element exists on the page and the clipboard api is avaliable (ie running in https)
	if (e && navigator.clipboard) {
		navigator.clipboard.writeText(document.location.href)
			.then(() => { console.log("copied to clipboard") })
			.catch(err => console.log(err))
	}
	else {
		console.warn("failed to clopy to clipboard (possibly not running on https. Roland fucked up!)")
	}
}

const toggleToc = (event) => {
	// get the table of contents
	const nav = document.getElementById("table-of-contents")
	// if it exisits toggle between display block and none
	if (nav) {
		const display = nav.style.display;

		// if its in block (or unset) then hide it 
		if (display == "block") {
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
})

const togglePermalinkAnchor = (id, entering) => {
	const e = (id) ? document.getElementById(id + "-permalinkAnchor") : undefined
	if (e) {
		if (entering) e.style.opacity = 1; else e.style.opacity = 0;
	}
}