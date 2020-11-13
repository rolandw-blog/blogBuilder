import React, { useState } from "react";
import Styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faSave,
	faTimesCircle,
	faUndo,
} from "@fortawesome/free-solid-svg-icons";

const EditContainer = Styled.form`
	display: grid;
	grid-template-columns: 1fr auto;

	// !center the button
	button {
		display: flex;
		align-self: center;
		grid-column: 2;
		padding: 0 10px;
	}

	.buttons {
		margin-left: auto;
	}

	input {
		width: 100%;
		margin: 0;
		padding: 0;
		background: #282C34;
		border-top: none;
		border-left: none;
		border-right: none;
		border-bottom: 1px solid #dedede;
		color: #dedede;
		font-size: 1em;
	}
`;

const DisplayContainer = Styled.div`
display: grid;
grid-template-columns: 30% 1fr 10%;

span {
	color: #dedede;
	// dont overflow text
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

button {
	display: flex;
	align-self: center;
	grid-column: 2;
	padding: 0 10px;
}

.buttons {
	margin-left: auto;
}
`;

// takes...
// ? name - name of the input field
// ? value - current value of the input field
export default function PageEditField(props) {
	const [editing, setEditing] = useState(false);
	const [firstValue, setFirstValue] = useState(props.value);
	const [value, setValue] = useState(props.value);
	const [newValue, setNewValue] = useState(props.value);

	const changeMode = () => {
		setEditing(!editing);
	};

	const exitNoSave = () => {
		console.log("exiting without saving");
		setValue(value);
		setNewValue(value);
		setEditing(!editing);
	};

	const saveInput = () => {
		console.log(`sending to to ${newValue}`);
		setValue(newValue);

		// encode the params
		const params = new URLSearchParams({
			[props.fieldName]: newValue,
		});

		// construct a fetch URL
		const url = encodeURI(
			`http://devel:3000/api/update/${props._id}?${params}`
		);
		console.log(url);

		// ship it!
		fetch(url, { method: "post", body: params })
			.then((res) => res.json())
			.then((doc) => {
				if (doc) {
					// if it was saved then go ahead and update the firstValue to be this new value
					// this prevents the "undo" button from appearing
					setFirstValue(newValue);
				}
				console.log(doc);
			});
		setEditing(!editing);
		console.log("phew");
	};

	const resetField = () => {
		setValue(firstValue);
	};

	return (
		<div>
			{editing ? (
				// display the field "name: value" and the edit button and save button
				<EditContainer id={props.value}>
					<input
						className="is-primary"
						defaultValue={value}
						id="inputField"
						disabled={props.disabled}
						onChange={(e) => {
							// every time the input field is changed change the prospective new value
							setNewValue(e.currentTarget.value);
						}}
					/>
					<div className="buttons">
						{/* save button */}
						<button className="button is-text" onClick={saveInput}>
							<FontAwesomeIcon
								className="has-text-right icon"
								icon={faSave}
							/>
						</button>

						{/* cancle button */}
						<button className="button is-text" onClick={exitNoSave}>
							<FontAwesomeIcon
								className="has-text-right icon"
								icon={faTimesCircle}
							/>
						</button>
					</div>
				</EditContainer>
			) : (
				<DisplayContainer>
					<span>{props.name}: </span>
					<span>{value}</span>

					{/* buttons */}
					<div className="buttons">
						{/* undo button */}
						{firstValue !== value ? (
							<button
								className="button is-text"
								onClick={resetField}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faUndo}
								/>
							</button>
						) : (
							<span></span>
						)}

						{/* edit button */}
						<div className="buttons">
							<button
								className="button is-text"
								onClick={changeMode}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faEdit}
								/>
							</button>
						</div>
					</div>
				</DisplayContainer>
			)}
		</div>
	);
}
