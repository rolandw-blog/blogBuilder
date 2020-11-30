import * as Yup from "yup";

const validationSchema = Yup.object({
	pageName: Yup.string().required("Required"),
	websitePath: Yup.string().required("Required"),
	hidden: Yup.bool(),
	sources: Yup.array(),
	meta: Yup.object({
		template: Yup.string()
			.oneOf(["blogPost.ejs", "menu.ejs", "homepage.ejs"])
			.required(),
	}),

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
