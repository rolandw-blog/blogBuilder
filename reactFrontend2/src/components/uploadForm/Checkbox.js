import React, { useState } from "react";

import { useField, Field } from "formik";
import { FormControlLabel } from "@material-ui/core";
import { Checkbox } from "formik-material-ui";

import { BlueCheckbox } from "./MUIStyles";

const MyCheckbox = ({ children, ...props }) => {
	// React treats radios and checkbox inputs differently other input types, select, and textarea.
	// Formik does this too! When you specify `type` to useField(), it will
	// return the correct bag of props for you
	const [field, meta] = useField({ ...props, type: "checkbox" });

	return (
		<div>
			<FormControlLabel
				control={
					<BlueCheckbox
						// ? formik controls
						{...field}
						{...props}
					/>
				}
				label="Hidden"
			/>

			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</div>
	);
};

export default MyCheckbox;
