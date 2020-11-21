export default async (pageIndex, pageSize) => {
	const pagination = `page=${pageIndex || 0}&per_page=${pageSize || 1}`;

	const url = `https://watch.rolandw.dev/pages?${pagination}`;
	// if in development then make the request against the dev server
	// const url =
	// 	process.env.NODE_ENV === "development"
	// 		? `http://devel:3000/api/pages?${pagination}`
	// 		: `/api/pages?websitePath=/notes/linux.*&regex=true&${pagination}`;

	console.log(`fetching items ${url}`);
	return fetch(url, { method: "get" });
};
