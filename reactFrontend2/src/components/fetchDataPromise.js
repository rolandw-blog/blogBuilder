export default async () => {
	console.log("fetching items");

	// if in development then make the request against the dev server
	const url =
		process.env.NODE_ENV === "development"
			? `http://devel:3000/api/pages`
			: `/api/pages?websitePath=/notes/linux.*&regex=true`;

	console.log(url);
	return fetch(url, { method: "get" });
};
