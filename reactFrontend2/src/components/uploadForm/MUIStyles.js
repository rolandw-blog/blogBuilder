import React from "react";
import { Checkbox } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

const BlueCheckbox = withStyles({
	root: {
		color: blue[400],
		"&$checked": {
			color: blue[600],
		},
	},
	checked: {},
})((props) => <Checkbox color="default" {...props} />);

/**
 * Generic styling for MUI elements on the UploadForm component
 */
const useStyles = makeStyles((theme) => ({
	root: {
		"& fieldset": {
			margin: theme.spacing(1, 0),
			// marginTop: theme.spacing(1),
			// marginBottom: theme.spacing(1),
		},
		"& pre": {
			color: "#dedede",
		},
	},
}));

const sourceRowStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			// margin: "auto",
			// backgroundColor: "red",
			// width: "25ch",
		},
		"& button": {
			// backgroundColor: "#121212",
			// display: "flex",
			// marginTop: "2.5px",
			// marginBottom: "2.5px",
			// height: "20px",
			// width: "25px",
		},
		// "& top-button": {
		// 	backgroundColor: "#121212",
		// 	// display: "flex",
		// },
		// "& input": {
		// 	// backgroundColor: "red",
		// 	margin: "0",
		// },
	},
}));

export { BlueCheckbox, sourceRowStyles, useStyles };
