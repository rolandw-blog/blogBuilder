export default async (_id) => {
	// if in development then make the request against the dev server
	const url =
		process.env.NODE_ENV === "development"
			? `http://devel:3000/api/history/find/${_id}`
			: `/history/find/${_id}`;

	console.log(`fetching items /history/find/${_id}`);
	return fetch(url, { method: "get" });
};
