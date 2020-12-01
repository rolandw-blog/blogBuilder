import React from "react";
import { useField } from "formik";
import { NativeSelect } from "@material-ui/core";

const MySelect = ({ label, ...props }) => {
	const [field, meta] = useField(props);

	return (
		<div>
			{/* <label htmlFor={props.id || props.name}>{label}</label> */}
			<NativeSelect {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</div>
	);
};

export default MySelect;
