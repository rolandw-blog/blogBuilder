document.addEventListener("DOMContentLoaded", () => {
	document.querySelector(".caret").addEventListener("mousedown", () => {


		// create the social box
		const socialBox = document.createElement("div")
		socialBox.className = "socialBox"

		// create things to put in the social box
		const twitter = document.createElement("img")
		twitter.src = "/media/twitter.svg"
		twitter.className = "socialImg"
		const linkedin = document.createElement("img")
		linkedin.src = "/media/linkedin.svg"
		linkedin.className = "socialImg"

		// put the things in the social box
		socialBox.appendChild(twitter)
		socialBox.appendChild(linkedin)

		// get the little spinny logo thing
		const caret = event.target;

		// load in and out the social box when you click on the spinny logo
		if (document.querySelector(".socialBox")) {
			document.querySelector(".socialBox").remove();
			caret.removeAttribute("id", "caret-flip")
		} else {
			event.target.parentNode.parentNode.appendChild(socialBox);
			caret.setAttribute("id", "caret-flip")
			socialBox.style.left = "50px;"
		}


	})
})
