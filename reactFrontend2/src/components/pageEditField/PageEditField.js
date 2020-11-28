import React, { useState, useDebugValue, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faSave,
	faTimesCircle,
	faUndo,
	faTrashAlt,
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
 * @param {string} props.deletable - A string of "display" "edit" or "add" to set the intial mode
 * @param {string} props.formCallback - A callback method that receives the _id, and URLSearchParams (url queryString)
 * @param {string} props.deleteCallback - A callback method that receives the _id, and URLSearchParams (url queryString)
 * @param {string} props.initialMode - A string of "display" "edit" or "add" to set the intial mode
 */
function PageEditField(props) {
	const [mode, setMode] = useState(props.initialMode);
	const [firstValue, setFirstValue] = useState(props.value, "firstValue");
	const [value, setValue] = useState(props.value);
	const [isDeleted, setIsDeleted] = useState(false);
	const newValue = useRef(""); // this is a ref because its just internally tracking the proposed field change value
	const [undoButton, setUndoButton] = useState(false);

	const exitNoSave = () => {
		console.log("exiting without saving");
		setValue(value);
		newValue.current = value;
		setMode("dispay");
	};

	// const saveInput = React.useCallback(() => {
	const saveInput = () => {
		try {
			props
				.formCallback(
					props._id,
					newValue.current,
					props.fieldName,
					value,
					firstValue
				)
				.then((res) => res.json())
				.then((doc) => {
					if (doc) {
						// if it was saved then go ahead and update the value (which is rendered in the field) to be this new value
						// set the value to the returned data after updating it to ensure it matches
						console.log(`value = ${doc.data[props.fieldName]}`);
						setValue(doc.data[props.fieldName]);
					}
					console.log(doc);
				});
			setMode("display");
			console.log("finished updating field successfully");
		} catch (err) {
			console.log(err);
			// TODO push an error to the client here
		}
	};
	// , [value, setMode, newValue, props, firstValue]);

	const resetField = () => {
		// change the field visually to the first value
		setValue(firstValue);

		// set the prospective new value to the first value
		newValue.current = firstValue;

		// save these changes
		saveInput();

		// hide the undo button
		setUndoButton(false);
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
							defaultValue={firstValue}
							id="inputField"
							disabled={props.disabled}
							onChange={(e) => {
								// every time the input field is changed change the prospective new value
								newValue.current = e.currentTarget.value;
								if (props.onChange) {
									props.onChange(e.currentTarget.value);
								}
							}}
						/>
						<div className="buttons">
							{/* save button */}
							<button
								className="button is-text"
								onClick={() => {
									saveInput();
									setUndoButton(true); // show the undo button to offer a "rollback"
								}}
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
								// setNewValue(e.currentTarget.value);
								newValue.current = e.currentTarget.value;
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

						{undoButton && (
							<button
								className="button is-text"
								onClick={resetField}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faUndo}
								/>
							</button>
						)}

						{/* edit button */}
						{!props.disabled && (
							<button
								className="button is-text field-edit-button"
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

						{props.deletable && (
							<button
								className="button is-text field-delete-button"
								onClick={() => {
									setIsDeleted(true);
									props.deleteCallback(
										props._id,
										newValue,
										props.fieldName,
										value,
										firstValue
									);
								}}
							>
								<FontAwesomeIcon
									className="has-text-right icon"
									icon={faTrashAlt}
								/>
							</button>
						)}
					</DisplayContainer>
				);
		}
	};

	// if its deleted, hide it
	return <BaseStyle>{!isDeleted ? renderField(mode) : <></>}</BaseStyle>;
}

export default PageEditField;
