import React from "react";
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

function SourcesSection() {
	// ? include handleSubmit if you want to submit from this component instead of including it in the overall form
	// ? const { handleSubmit, values } = useFormikContext(); // formikProps
	const { values } = useFormikContext(); // formikProps
	const classes = sourceRowStyles();

	return (
		<FieldArray
			name="source"
			render={(arrayHelpers) => (
				<div className={classes.root}>
					{values.source && values.source.length > 0 ? (
						values.source.map((source, index) => (
							<SourceRow key={index}>
								{/* {JSON.stringify(source)} */}
								<MyCheckbox
									// the box comes checked
									// checked={true}
									// the form control (name)
									name={`source[${index}].remote`}
									// value={`source[${index}].remote`}
									// what is displayed on the page (label)
									// label="remote"
								>
									Remote
								</MyCheckbox>
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
