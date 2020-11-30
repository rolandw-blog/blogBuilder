import React from "react";
import { useField, FastField } from "formik";
import { TextField } from "formik-material-ui";

const MyTextInput = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input>. We can use field meta to show an error
	// message if the field is invalid and it has been touched (i.e. visited)
	const [field, meta] = useField(props);

	// remove the placeHolder so its not passed to Field as placeholder={props.placeholder}
	// instead we need to pass props.placeholder as a label for material UI to animate it
	delete props.placeholder;

	return (
		<div noValidate autoComplete="off">
			{/* <label htmlFor={props.id || props.name}>{label}</label> */}
			<FastField
				// ? material UI binding to style it as a textfield
				component={TextField}
				// styled component props
				variant="outlined"
				label={label}
				// formik props
				className="text-input"
				{...field}
				{...props}
			/>
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</div>
	);
};

export default MyTextInput;
