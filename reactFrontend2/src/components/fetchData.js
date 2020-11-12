export default async () => {
	console.log("fetching items");

	// if in development then make the request against the dev server
	const url =
		process.env.NODE_ENV === "development"
			? `http://devel:3000/api/pages?websitePath=/notes/linux.*&regex=true`
			: `/api/pages?websitePath=/notes/linux.*&regex=true`;

	console.log(url);
	const data = await fetch(url, { method: "get" });
	// console.log(await data.json());
	return await data.json();
};
