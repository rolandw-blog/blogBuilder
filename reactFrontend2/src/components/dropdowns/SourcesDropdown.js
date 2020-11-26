import React, { useState, useEffect } from "react";
import PageEditField from "../pageEditField/PageEditField";
import "../../styles/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleDown,
	faAngleUp,
	faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Collapsible } from "./styles";
// import Dropdown from "./Dropdown";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { EditContainer } from "../pageEditField/pageEditContainer";

function DropdownButton(props) {
	const { collapsed } = props;
	return (
		<FontAwesomeIcon
			onClick={(e) => {
				e.preventDefault();
			}}
			className="has-text-right icon"
			icon={collapsed ? faAngleUp : faAngleDown}
			color={"white"}
		/>
	);
}

function PlusButton(props) {
	return (
		<FontAwesomeIcon
			onClick={(e) => {
				console.log("add button clicked");
				e.preventDefault();
				props.onClick();
			}}
			className="has-text-right icon"
			icon={faPlusCircle}
			color={"white"}
		/>
	);
}

const renderData = (url, _id, index) => {
	return (
		<PageEditField
			noTitle
			name={"URL"}
			value={url}
			fieldName={"url"}
			_id={_id}
			color={"#363636"}
			key={_id + "/" + url + index}
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
			onChange={(newValue) => {
				console.log(newValue);
			}}
		/>
	);
};

export default function SourcesDropdown(props) {
	const [collapsed, setCollapsed] = useState(false);
	const [buttonText, setButtonText] = useState(`Open ${props.name}`);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [fields, setFields] = useState([]);
	const [addFieldIndex, setAddFieldIndex] = useState(0);

	const { _id } = props;
	const { source } = props;
	const { name } = props;
	const { addField } = props;

	const loadData = () => {
		if (!collapsed) {
			const data =
				source instanceof Array && source !== undefined
					? source
					: new Array(source);
			// setData(data);
			console.log(data);
			// console.log(data[0].url);
			// addField(data[0].url, 0);
			setFields(fields.concat(data));

			setLoading(false);
		}
	};

	const handleCollapser = (event) => {
		event.preventDefault();
		setCollapsed(!collapsed);

		// get the target conent div to show/hide it
		const content = event.target.closest("div").querySelector(".content");

		if (collapsed) {
			content.className = "content collapsed";
			setButtonText(`Open ${props.name}`);
		} else {
			content.className = "content";
			setButtonText(`Close ${props.name}`);
			loadData();
		}
	};

	// useEffect(() => {
	// 	console.log("state change", addFieldIndex);
	// 	return () => {
	// 		console.log("unmount");
	// 	};
	// }, [addFieldIndex]);

	const handleAddField = () => {
		console.log("adding field");
		setFields(fields.concat({ url: "" }));
	};

	return (
		<Collapsible>
			<a href={"/"} onClick={handleCollapser}>
				{buttonText} <DropdownButton collapsed={collapsed} />
			</a>

			<div className="content collapsed">
				{
					!loading &&
						fields.map((field, index) => {
							// return <div key={index}>{field.url}</div>;
							return renderData(field.url, _id, index);
						})
					// data.map((data, index) => {
					// 	return renderData(data.url, index);
					// })}
				}
				{/* {!loading && props.addField && renderData("", _id)} */}
				{!loading && fields.length === 0 && `No data found.`}
				Add <PlusButton onClick={handleAddField} />
			</div>
		</Collapsible>
	);

	// return (
	// 	<Dropdown
	// 		_id={_id}
	// 		name={"sources"}
	// 		fetchDataCallback={() => {
	// 			return fetchData();
	// 		}}
	// 		renderDataCallback={(data, _id, index) => {
	// 			return sourceEntry(data.url, _id);
	// 		}}
	// 		addField={true}
	// 		renderAddFieldCallback={(index) => {
	// 			// return "Hello";
	// 			return (
	// 				<PageEditField
	// 					noTitle
	// 					name={"URL"}
	// 					// the addFields value text should be nothing
	// 					value={""}
	// 					fieldName={"url"}
	// 					_id={_id}
	// 					color={"#363636"}
	// 					key={_id + "/addField" + index}
	// 					initialMode={"add"}
	// 					formCallback={(_id, newValue, fieldName, value) => {
	// 						console.log(_id, newValue, fieldName, value);
	// 						const body = {
	// 							_id: _id,
	// 							url: newValue,
	// 							remote: true,
	// 						};

	// 						const headers = {
	// 							"Content-type":
	// 								"application/json; charset=UTF-8",
	// 						};

	// 						return fetch(
	// 							"https://watch.rolandw.dev/update/history/add",
	// 							{
	// 								method: "post",
	// 								headers: headers,
	// 								body: JSON.stringify(body),
	// 							}
	// 						);
	// 					}}
	// 				/>
	// 			);
	// 		}}
	// 	/>
	// );
}
