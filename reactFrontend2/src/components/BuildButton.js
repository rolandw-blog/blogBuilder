import React, { useState } from "react";
import { Button } from "@material-ui/core";

const BuildButton = (props) => {
	const { _id } = props;

	const [isSubmitting, setIsSubmitting] = useState(false);

	const fakeTimeout = async () => {
		return await new Promise((resolve) =>
			setTimeout(() => {
				resolve({ success: true });
			}, 1000)
		);
	};

	const buildPage = async (_id) => {
		const buildUrl = `https://build.rolandw.dev/build/${_id}`;
		const timeout = 10000;

		// this wires into fetch to abort it
		const controller = new AbortController();

		// plug the timeout and controller signal into the request
		const options = {
			method: "GET",
			timeout: timeout,
			signal: controller.signal,
		};

		// start a timer and abort if it runs out
		const id = setTimeout(() => controller.abort(), timeout);

		try {
			// start the request (has the controller and timeout in its options)
			const result = (await fetch(buildUrl, options)).json();
			console.log(result);

			// if we got here then the request completed, so cancle the timer
			clearTimeout(id);

			return result;
		} catch (err) {
			// TODO return some error and handle it in the button
			return {};
		}
	};

	return (
		<Button
			// MUI props
			variant="contained"
			type="submit"
			color="primary"
			disabled={isSubmitting}
			// cell props
			onClick={async () => {
				// disable the button
				setIsSubmitting(true);

				// start building the page
				console.log("building page...");
				const page = await buildPage(_id);

				// once the page is build enable the button
				console.log("done building page");
				console.log(page);
				setIsSubmitting(false);
			}}
		>
			Build
		</Button>
	);
};

export default BuildButton;
