import React from "react";
import PageEditField from "../PageEditField";
import "../../styles/styles.scss";
import Dropdown from "./Dropdown";

/**
 *
 * @param {JSON} data - {remote: bool, url: string}
 */
const sourceEntry = (data, _id) => {
	// console.log("rendering source entry", data.url);
	return (
		<div key={_id + "/" + data.url}>
			<PageEditField
				noTitle
				name={"URL"}
				value={data.url}
				fieldName={"url"}
				_id={_id}
				color={"#363636"}
				// props._id, props.fieldName, value, newValue
				formCallback={(_id, newValue, fieldName, value) => {
					// UPDATE WHERE SELECT _id IS _id
					const filter = { _id: _id };

					// SET source.url = newValue
					const update = { source: { url: newValue } };

					// print them out for debugging
					// console.log(`filter: ${JSON.stringify(filter)}`);
					// console.log(`update: ${JSON.stringify(update)}`);

					// construct the body request
					const body = {
						filter,
						update,
					};

					// stringify it for the POST request
					console.log("stringifying the body");
					const bodyString = JSON.stringify(body);

					// send the post request
					const url = `https://watch.rolandw.dev/update/${_id}`;
					return fetch(url, {
						method: "POST",
						headers: {
							"Content-type": "application/json; charset=UTF-8",
						},
						body: bodyString,
					});
				}}
			/>
		</div>
	);
};

export default function SourcesDropdown(props) {
	const { _id } = props;

	// mock the "api call" to the database
	// because we already have the source information on hand
	const fetchData = () => {
		const { source } = props;

		// turn it into an array if it isnt already
		const result =
			source instanceof Array && source !== undefined
				? source
				: new Array(source);

		// console.log(JSON.stringify({ data: result }));
		return { data: result };
	};

	return (
		<Dropdown
			_id={_id}
			name={"sources"}
			fetchDataCallback={() => {
				return fetchData();
			}}
			renderDataCallback={(data, _id, index) => {
				// console.log("render callback data:");
				// console.log(data);
				return sourceEntry(data, _id);
			}}
		></Dropdown>
	);
}
