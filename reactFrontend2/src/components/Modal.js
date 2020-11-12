import React, { useState } from "react";
// eslint-disable-next-line
// import bulma from "bulma";
import "../styles/styles.scss";
// import Styled from "styled-components";
import PageEditField from "./PageEditField";

// const valueList = (values) => {
// 	return values.map((v, i) => {
// 		return (
// 			<PageEditField name={v.name} value={v.value} />
// 			// <li className="list-item" key={i}>
// 			// 	<span>{v.name}</span>:{" "}
// 			// 	<span className="is-family-code has-background-info">
// 			// 		{v.value}
// 			// 	</span>
// 			// </li>
// 		);
// 	});
// };

export default function Model(props) {
	const [open, setOpen] = useState(false);

	// uses the setOpen() state to control the modal
	function toggleModal(e) {
		e.preventDefault();
		setOpen(!open);
		console.log("The link was clicked.");
	}

	// a tempalte that defines the different
	const formFields = [
		{ name: "ID", fieldName: "_id", value: props._id },
		{
			name: "Page Name",
			fieldName: "pageName",
			value: props.pageName,
		},
		{
			name: "Website Path",
			fieldName: "websitePath",
			value: props.websitePath,
		},
		{ name: "Hidden", fieldName: "hidden", value: props.hidden },
		{
			name: "Version/Revision",
			fieldName: "__v",
			value: props.__v,
		},
	];

	// const test = []

	// const createFormStates = formFields.map((field, i) => {
	// 	return this.setState({ [field.value]: field.value });
	// });

	const formFieldComponents = formFields.map((field, i) => {
		return (
			<PageEditField
				props={field}
				name={field.name}
				fieldName={field.fieldName}
				value={field.value}
				key={i}
				_id={props._id}
				disabled={
					field.fieldName === "_id" || field.fieldName === "__v"
						? true
						: false
				}
			/>
		);
	});

	// console.log(createFormStates);

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
						<p className="modal-card-title">Modal Editor</p>
						<button
							className="delete"
							aria-label="close"
							onClick={toggleModal}
						></button>
					</header>
					<section className="modal-card-body">
						{formFieldComponents.map((field) => {
							return field;
						})}
					</section>
					<footer className="modal-card-foot"></footer>
				</div>
				{/* End modal card */}
			</div>
			{/* End modal wrapper */}
		</>
	);
}
