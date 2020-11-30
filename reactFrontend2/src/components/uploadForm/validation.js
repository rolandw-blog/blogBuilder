import * as Yup from "yup";

const validationSchema = Yup.object({
	pageName: Yup.string().required("Required"),
	websitePath: Yup.string().required("Required"),
	hidden: Yup.bool(),
	sources: Yup.array(Yup.object({ url: Yup.string().required() })),
	meta: Yup.object({
		template: Yup.string()
			.oneOf(["blogPost.ejs", "menu.ejs", "homepage.ejs"])
			.required(),
	}),
});

export default validationSchema;
