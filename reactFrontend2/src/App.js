import React from "react";
import Pages from "./components/Pages";
import UploadForm from "./components/uploadForm/UploadForm";
import styled from "styled-components";
import { BrowserRouter, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { purple } from "@material-ui/core/colors";

const Styles = styled.div`
	color: #dedede;
	font-size: calc(10px + 1.5vmin);
	// padding: 0 10%;
`;

// const theme = createMuiTheme({
// 	typography: {
// 		fontFamily: [
// 			"-apple-system",
// 			"BlinkMacSystemFont",
// 			'"Segoe UI"',
// 			"Roboto",
// 			'"Helvetica Neue"',
// 			"Arial",
// 			"sans-serif",
// 			'"Apple Color Emoji"',
// 			'"Segoe UI Emoji"',
// 			'"Segoe UI Symbol"',
// 		].join(","),
// 	},
// });

const theme = createMuiTheme({
	typography: {
		fontFamily: "Cantarell, Raleway, Arial",
	},
	overrides: {
		MuiCssBaseline: {
			"@global": {
				"@font-face": "Cantarell",
			},
		},
	},
	palette: {
		type: "dark",
		background: {
			default: "#282c34",
		},
	},
});

// palette: {
// 	// type: "dark",
// 	// primary: {
// 	// 	light: "#dedede",
// 	// 	main: "#363636",
// 	// 	dark: "#121212",
// 	// },
// 	// secondary: {
// 	// 	light: "f6a5c0",
// 	// 	main: "#f48fb1",
// 	// 	dark: "aa647b",
// 	// },
// 	// error: {
// 	// 	light: "#e57373",
// 	// 	main: "#f44336",
// 	// 	dark: "#d32f2f",
// 	// },
// 	// warning: {
// 	// 	light: "#ffb74d",
// 	// 	main: "#ff9800",
// 	// 	dark: "#f57c00",
// 	// },
// 	// info: {
// 	// 	light: "#64b5f6",
// 	// 	main: "#2196f3",
// 	// 	dark: "#1976d2",
// 	// },
// 	// success: {
// 	// 	light: "#81c784",
// 	// 	main: "#4caf50",
// 	// 	dark: "#388e3c",
// 	// },
// },

// const routes = (
// 	<Route>
// 		<Route path="*" handler={Pages} />
// 	</Route>
// );

function App() {
	// <CssBaseline />;
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Styles>
				<BrowserRouter>
					{/* <div> */}
					{/* <hr /> */}
					<Route exact path="/" component={Pages} />
					<Route exact path="/upload" component={UploadForm} />
					{/* </div> */}
				</BrowserRouter>
			</Styles>
		</ThemeProvider>
	);
}

export default App;
