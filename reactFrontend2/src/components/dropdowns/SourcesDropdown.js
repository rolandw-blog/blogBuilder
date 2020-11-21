import React from "react";
import PageEditField from "../pageEditField/PageEditField";
import "../../styles/styles.scss";
import Dropdown from "./Dropdown";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { EditContainer } from "../pageEditField/pageEditContainer";

/**
 *
 * @param {JSON} data - {remote: bool, url: string}
 */
const sourceEntry = (url, _id) => {
	// console.log("rendering source entry", data.url);
	return (
		<PageEditField
			noTitle
			name={"URL"}
			value={url}
			fieldName={"url"}
			_id={_id}
			color={"#363636"}
			key={_id + "/" + url}
			// props._id, props.fieldName, value, newValue
			formCallback={async (
				_id,
				newValue,
				fieldName,
				value,
				firstValue
			) => {
				// UPDATE WHERE SELECT _id IS _id
				const filter = { _id: _id };

				// print them out for debugging
				// console.log(`filter: ${JSON.stringify(filter)}`);
				// console.log(`update: ${JSON.stringify(update)}`);

				// ##──────────────────────────────────────────────────────────────────────────────────────
				// The goal of this code is to
				// 1. get the og page.source from the database
				// 2. remove the og value from it and keep everything else
				// 3. replace the og value with our new one
				// 4. submit that new array back as our updated sources list
				const doc = await (
					await fetch(`https://watch.rolandw.dev/page?_id=${_id}`)
				).json();

				// console.log(doc.source);
				const sourceArray = doc.source;
				console.log(`avoiding ${firstValue}`);

				// get everything that isnt the first value from the og sources list
				const newSourceList = sourceArray
					.filter((source) => source.url !== firstValue)
					.map((source) => source);

				// now push our new source to the array that doesnt contain the one we are changing
				newSourceList.push({ remote: true, url: newValue });

				// fully overwrite the source list with our new one
				const update = { source: newSourceList };

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
				return sourceEntry(data.url, _id);
			}}
			addField={true}
			renderAddFieldCallback={() => {
				// return "Hello";
				return (
					<PageEditField
						noTitle
						name={"URL"}
						// the addFields value text should be nothing
						value={""}
						fieldName={"url"}
						_id={_id}
						color={"#363636"}
						key={_id + "/addField"}
						initialMode={"add"}
						formCallback={(_id, newValue, fieldName, value) => {
							console.log(_id, newValue, fieldName, value);
							const body = {
								_id: _id,
								url: newValue,
								remote: true,
							};

							const headers = {
								"Content-type":
									"application/json; charset=UTF-8",
							};

							return fetch(
								"https://watch.rolandw.dev/update/history/add",
								{
									method: "post",
									headers: headers,
									body: JSON.stringify(body),
								}
							);
						}}
					/>
				);
			}}
		/>
	);
}
