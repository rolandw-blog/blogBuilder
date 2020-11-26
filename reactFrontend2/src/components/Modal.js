import React, { useState } from "react";
import HistoryDropdown from "./dropdowns/HistoryDropdown";
import SourcesDropdown from "./dropdowns/SourcesDropdown";
import "../styles/styles.scss";

import PageEditField from "./pageEditField/PageEditField";

export default function Model(props) {
	// console.log(props);
	const [open, setOpen] = useState(false);
	const [fields, setFields] = useState([]);

	// uses the setOpen() state to control the modal
	function toggleModal(e) {
		e.preventDefault();

		// set open to the opposite
		setOpen(!open);

		// if the modal is opening load in the fields for it
		if (!open) {
			console.log(`loading fields for the modal: "${props.pageName}"`);
			setFields(
				formFieldComponents.map((field) => {
					return field;
				})
			);
		}
	}

	// a tempalte that defines each field in the edit
	const formFields = [
		{
			name: "ID",
			fieldName: "_id",
			value: props._id,
			disabled: true,
		},
		{
			name: "Page Name",
			fieldName: "pageName",
			value: props.pageName,
			disabled: false,
		},
		{
			name: "Website Path",
			fieldName: "websitePath",
			value: props.websitePath,
			disabled: false,
		},
		{
			name: "Hidden",
			fieldName: "hidden",
			value: props.hidden,
			disabled: false,
		},
		{
			name: "Revision",
			fieldName: "__v",
			value: props.__v,
			history: props.history,
			disabled: true,
		},
	];

	const formFieldComponents = formFields.map((field, i) => {
		return (
			<PageEditField
				name={field.name}
				fieldName={field.fieldName}
				value={field.value}
				key={i}
				_id={props._id}
				disabled={field.disabled}
				color={"#282C34"}
				formCallback={(_id, newValue, fieldName, value) => {
					// UPDATE WHERE SELECT _id IS _id
					const filter = { _id: _id };

					// SET source.url = newValue
					const update = { [fieldName]: newValue };

					// print them out for debugging
					// console.log(`filter: ${JSON.stringify(filter)}`);
					// console.log(`update: ${JSON.stringify(update)}`);

					// construct the body request
					const body = {
						filter: filter,
						update: update,
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
	});

	return (
		<>
			<button
				className="button is-dark"
				key={props.cellID}
				onClick={toggleModal}
			>
				Edit
			</button>

			{/* Modal wrapper */}
			<div className={`modal ${open ? "is-active" : ""} `}>
				{/* Dim background */}
				<div className="modal-background" onClick={toggleModal}></div>

				{/* Modal card */}
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">{props.pageName}</p>
						<button
							className="delete"
							aria-label="close"
							onClick={toggleModal}
						></button>
					</header>
					<section className="modal-card-body">
						{/* print out every form field for this modal */}
						<div className="fieldsGoHere">
							{fields.map((f) => {
								return f;
							})}
						</div>
						{/* {formFieldComponents.map((field) => {
							// console.log(field);
							return field;
						})} */}
						<HistoryDropdown
							_id={props.data.original._id}
							source={props.data.original.source}
						></HistoryDropdown>
						<SourcesDropdown
							_id={props.data.original._id}
							source={props.data.original.source}
							addField={true}
							name={"sources"}
						></SourcesDropdown>
					</section>
					<footer className="modal-card-foot">
						{/* <button className="button is-dark">View history</button> */}
					</footer>
				</div>
				{/* End modal card */}
			</div>
			{/* End modal wrapper */}
		</>
	);
}
