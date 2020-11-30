import React from "react";
import ReactDOM from "react-dom";
import {
	Formik,
	Form,
	useField,
	useFormikContext,
	FieldArray,
	Field,
} from "formik";
import {
	Button,
	Container,
	Box,
	Paper,
	NativeSelect,
	FormControlLabel,
	Checkbox,
	Typography,
} from "@material-ui/core";
import { makeStyles, styled, withStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import Styled from "styled-components";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";

const validationSchema = Yup.object({
	firstName: Yup.string()
		.max(15, "Must be 15 characters or less")
		.required("Required"),
	lastName: Yup.string()
		.max(20, "Must be 20 characters or less")
		.required("Required"),
	// email: Yup.string()
	// 	.email("Invalid email address")
	// 	.required("Required"),
	acceptedTerms: Yup.boolean()
		.required("Required")
		.oneOf([true], "You must accept the terms and conditions."),

	jobType: Yup.string()
		.oneOf(
			["designer", "development", "product", "other"],
			"Invalid Job Type"
		)
		.required("Required"),
});

export default validationSchema;
