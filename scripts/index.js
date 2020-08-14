document.addEventListener("DOMContentLoaded", () => {
	document.querySelector(".caret").addEventListener("mousedown", () => {
		// create the social box
		const socialBox = document.createElement("div");
		socialBox.className = "socialBox";

		socialBox.appendChild(
			createSocialIcon(
				"/media/twitter.svg",
				"https://twitter.com/RolandIRL"
			)
		);
		socialBox.appendChild(
			createSocialIcon(
				"/media/linkedin.svg",
				"https://www.linkedin.com/in/roland-w/"
			)
		);
		socialBox.appendChild(
			createSocialIcon(
				"/media/github.svg",
				"https://github.com/RolandWarburton"
			)
		);

		// get the little spinny logo thing
		const caret = event.target;

		// load in and out the social box when you click on the spinny logo
		if (document.querySelector(".socialBox")) {
			document.querySelector(".socialBox").remove();
			caret.removeAttribute("id", "caret-flip");
		} else {
			event.target.parentNode.parentNode.appendChild(socialBox);
			caret.setAttribute("id", "caret-flip");
		}
	});
});

const createSocialIcon = function (imagePath, socialLink) {
	const socialIconAnchor = document.createElement("a");
	socialIconAnchor.href = socialLink;
	socialIconAnchor.className = "darkHyperLink";

	const socialIconImage = document.createElement("img");
	socialIconImage.src = imagePath;

	socialIconAnchor.appendChild(socialIconImage);

	return socialIconAnchor;
};
