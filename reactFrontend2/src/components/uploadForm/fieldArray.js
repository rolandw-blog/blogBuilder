import React, { useState, useEffect, getIn } from "react";
import {
	useFormikContext,
	FieldArray,
	Field,
	FastField,
	useField,
} from "formik";
import { Button } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { SourceRow } from "./UploadForm.styles";
import { sourceRowStyles } from "./MUIStyles";
import MyCheckbox from "./Checkbox";

const ErrorMessage = ({ name }) => (
	<Field
		name={name}
		render={({ form }) => {
			const error = getIn(form.errors, name);
			const touch = getIn(form.touched, name);
			return touch && error ? error : null;
		}}
	/>
);

function SourcesSection() {
	// ? include handleSubmit if you want to submit from this component instead of including it in the overall form
	// ? const { handleSubmit, values } = useFormikContext(); // formikProps
	const { values, errors } = useFormikContext(); // formikProps
	const classes = sourceRowStyles();

	const [checkedSources, setCheckedSources] = useState([]);

	useEffect(() => {
		console.log("updated");
		// setCheckedSources()
		return () => {
			// cleanup
		};
	}, [values.source]);

	return (
		<FieldArray
			name="source"
			render={(arrayHelpers) => (
				<div className={classes.root}>
					{values.source && values.source.length > 0 ? (
						values.source.map((source, index) => (
							<SourceRow key={index}>
								<FastField
									// ? material UI binding to style it as a textfield
									component={TextField}
									// ? material UI props
									variant="outlined"
									label={`url ${index}`}
									// ? formik props
									name={`source[${index}].url`}
									// placeholder={`url ${index}`}
								/>
								{/* <IncrementDecrementButtonGroup> */}
								<Button
									className="top-button"
									// ? material UI props
									variant="contained"
									color="primary"
									size="small"
									// formik props
									type="button"
									onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
								>
									-
								</Button>
								<Button
									// ? material UI props
									variant="contained"
									color="primary"
									// ? formik props
									type="button"
									onClick={() =>
										arrayHelpers.insert(index + 1, "")
									} // insert an empty string at a position
								>
									+
								</Button>
								{/* </IncrementDecrementButtonGroup> */}
							</SourceRow>
						))
					) : (
						<Button
							// ? material UI props
							variant="contained"
							color="primary"
							size="small"
							// ? formik props
							type="button"
							onClick={() => arrayHelpers.push("")}
						>
							{/* show this when user has removed all sources from the list */}
							Add page sources
						</Button>
					)}
				</div>
			)}
		/>
	);
}
export default SourcesSection;
