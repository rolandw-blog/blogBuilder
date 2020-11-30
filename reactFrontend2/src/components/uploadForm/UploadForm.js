import React, { useState } from "react";
import { Formik, Form, Field, getIn } from "formik";
import { Button, Container, Paper } from "@material-ui/core";
import { Fieldset, FormWrapper, SubmitWrapper } from "./UploadForm.styles";
import { useStyles } from "./MUIStyles";
import validationSchema from "./validation";
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

const SignupForm = () => {
	const classes = useStyles();
	return (
		<Container className={classes.root} maxWidth="md">
			<Paper elevation={3} elementtype="section">
				<Formik
					initialValues={{
						pageName: "",
						websitePath: "",
						hidden: false, // added for our checkbox
						// sources: [{ remote: true, url: "" }],
						source: [{ url: "" }],
						meta: { template: "" },
					}}
					// validateOnChange={false}
					// validateOnBlur={false}
					validationSchema={validationSchema}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2));

							setSubmitting(false);
						}, 400);
					}}
					handleChange={(event) => {
						console.log("alert!");
					}}
				>
					{({ values }) => {
						return (
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
										<MyCheckbox
											// the form control (name)
											name="hidden"
											// what is displayed on the page (label)
											label="hidden"
										>
											Hide page
										</MyCheckbox>
									</Fieldset>

									{/* template dropdown */}
									<Fieldset>
										<MySelect
											label="Template"
											name="meta.template"
										>
											<option value="">
												Select a template
											</option>
											<option value="blogPost.ejs">
												blogPost.ejs
											</option>
											<option value="menu.ejs">
												menu.ejs
											</option>
											<option value="homePage.ejs">
												homePage.ejs
											</option>
										</MySelect>
									</Fieldset>

									{/* submit */}
									<SubmitWrapper>
										<Button
											variant="contained"
											type="submit"
											color="primary"
										>
											Submit
										</Button>
									</SubmitWrapper>

									<ErrorMessage name="source[0].url" />
									<Paper elevation={3}>
										<pre>
											<code>
												{JSON.stringify(
													values,
													"\n",
													4
												)}
											</code>
										</pre>
									</Paper>
								</Form>
							</FormWrapper>
						);
					}}
				</Formik>
			</Paper>
		</Container>
	);
};

export default SignupForm;
