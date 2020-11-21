import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faSave,
	faTimesCircle,
	faUndo,
	faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

import {
	DisplayContainer,
	EditContainer,
	BaseStyle,
} from "./pageEditfield.style";

// takes...
// ? name - name of the input field
// ? value - current value of the input field
/**
 *
 * @param {string} props.value - The initial text field string
 * @param {string} props._id - The ID of the document this field belongs to
 * @param {string} props.fieldName - The real name of the field in the database
 * @param {string} props.disabled - Set this if you wish for the field to be turned off
 * @param {string} props.formCallback - A callback method that receives the _id, and URLSearchParams (url queryString)
 * @param {string} props.initialMode - A string of "display" "edit" or "add" to set the intial mode
 */
function PageEditField(props) {
	const [mode, setMode] = useState(props.initialMode);
	const [firstValue, setFirstValue] = useState(props.value);
	const [value, setValue] = useState(props.value);
	const [newValue, setNewValue] = useState(props.value);

	const exitNoSave = () => {
		console.log("exiting without saving");
		setValue(value);
		setNewValue(value);
		setMode("dispay");
	};

	// useEffect(() => {
	// 	console.log("loaded");
	// }, []);

	const saveInput = React.useCallback(() => {
		setValue(newValue);
		console.log(props.formCallback);
		try {
			props
				.formCallback(props._id, newValue, props.fieldName, value)
				.then((res) => res.json())
				.then((doc) => {
					if (doc) {
						// if it was saved then go ahead and update the firstValue to be this new value
						// this prevents the "undo" button from appearing
						setFirstValue(newValue);
					}
					console.log(doc);
				});
			setMode("display");
			console.log("finished updating field successfully");
		} catch (err) {
			console.log(err);
			// TODO push an error to the client here
		}
	}, [value, setMode, newValue, props]);

	const resetField = () => {
		setValue(firstValue);
	};

	/**
	 *
	 * @param {String} type - display | edit | add
	 */
	const renderField = () => {
		// console.log(`mode: ${mode}`);
		switch (mode) {
			case "edit":
				return (
					// display the field "name: value" and the edit button and save button
					<EditContainer id={props.value} color={props.color}>
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
							<button
								className="button is-text"
								onClick={saveInput}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faSave}
								/>
							</button>

							{/* cancle button */}
							<button
								className="button is-text"
								onClick={exitNoSave}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faTimesCircle}
								/>
							</button>
						</div>
					</EditContainer>
				);

			case "add":
				return (
					// display the field "name: value" and the edit button and save button
					<EditContainer id={props.value} color={props.color}>
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
							<button
								className="button is-text"
								onClick={saveInput}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faPlusCircle}
								/>
							</button>
						</div>
					</EditContainer>
				);

			case "display":
			default:
				return (
					<DisplayContainer
						noTitle={props.noTitle ? true : false}
						color={props.color}
					>
						{/* only print if noTitle is not included */}
						{!props.noTitle && <span>{props.name}: </span>}
						<span>{value}</span>

						{/* ! DEPRECARED BECAUSE I NEED TO FIX STYLING  */}
						{/* {firstValue !== value ? (
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
						)} */}

						{/* edit button */}
						{!props.disabled && (
							<button
								className="button is-text"
								onClick={() => {
									setMode("edit");
								}}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faEdit}
								/>
							</button>
						)}
					</DisplayContainer>
				);
		}
	};

	return <BaseStyle>{renderField(mode)}</BaseStyle>;
}

export default PageEditField;
