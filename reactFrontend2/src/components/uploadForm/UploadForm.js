import React from "react";
import { Formik, Form } from "formik";
import { Button, Container, Paper } from "@material-ui/core";
import { Fieldset, FormWrapper, SubmitWrapper } from "./UploadForm.styles";
import { useStyles } from "./MUIStyles";
// import validationSchema from "./validation";
import MyTextInput from "./Input";
import MyCheckbox from "./Checkbox";
import MySelect from "./Option";
import SourcesSection from "./fieldArray";

// {
//     "pageName": "testPage",
//     "source": [{"remote": true, "url": "a.com"}],
//     "websitePath": "/deleteMe",
//     "hidden": false,
//     "meta": {"template": "blogPost.ejs"}
// }

const SignupForm = () => {
	const classes = useStyles();

	return (
		<Container className={classes.root} maxWidth="md">
			<Paper elevation={3} elementType={"div"}>
				<Formik
					initialValues={{
						pageName: "",
						websitePath: "",
						hidden: false, // added for our checkbox
						sources: ["", "", ""],
						meta: { template: "" },
					}}
					// validationSchema={validationSchema}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2));

							setSubmitting(false);
						}, 400);
					}}
				>
					<FormWrapper>
						<Form>
							<h1>Add page</h1>
							<Fieldset>
								{/* page name */}
								<MyTextInput
									label="Page Name"
									name="pageName"
									type="text"
									placeholder="page name"
								/>

								{/* website path */}
								<MyTextInput
									label="Website Path"
									name="websitePath"
									type="text"
									placeholder="website path"
								/>
							</Fieldset>

							<Fieldset>
								<SourcesSection></SourcesSection>
							</Fieldset>

							{/* page hidden */}
							<Fieldset>
								<MyCheckbox name="hidden">Hide page</MyCheckbox>
							</Fieldset>

							{/* template */}

							<Fieldset>
								<MySelect label="Template" name="meta.template">
									<option value="">Select a template</option>
									<option value="blogPost.ejs">
										blogPost.ejs
									</option>
									<option value="menu.ejs">menu.ejs</option>
									<option value="homePage.ejs">
										homePage.ejs
									</option>
								</MySelect>
							</Fieldset>

							<SubmitWrapper>
								<Button
									variant="contained"
									type="submit"
									color="primary"
								>
									Submit
								</Button>
							</SubmitWrapper>
						</Form>
					</FormWrapper>
				</Formik>
			</Paper>
		</Container>
	);
};

export default SignupForm;
