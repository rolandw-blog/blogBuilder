const scrollToHash = () => {
	const hash = window.location.hash
	const e = (hash) ? document.getElementById(window.location.hash.replace('#', '')) : undefined;
	if (e) {
		e.scrollIntoView();
		const oldColor = e.style.color
		
		// show the user the anchor link the url is pointing to
		e.style.color = "#dedede";

		// timeout the window then set the color back for the anchor
		window.setTimeout(() => {
			e.style.color = oldColor; 
		  }, 800);
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

// const showParentTitle = (element) => {
// 	const e = document.querySelectorAll("h1");
// 	console.log(e);
// }

document.addEventListener("DOMContentLoaded", (e) => {
	scrollToHash()
})

const togglePermalinkAnchor = (id, entering) => {
	const e = (id) ? document.getElementById(id+"-permalinkAnchor") : undefined
	if (e) {
		if (entering) e.style.opacity = 1; else e.style.opacity = 0;
	}
}