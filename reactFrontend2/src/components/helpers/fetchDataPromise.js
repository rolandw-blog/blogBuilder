export default async (pageIndex, pageSize, searchFilter) => {
	const pagination = `page=${pageIndex || 0}&per_page=${pageSize || 1}`;

	let url = "";
	if (searchFilter) {
		url = `https://watch.rolandw.dev/pages/${searchFilter}?${pagination}`;
	} else {
		url = `https://watch.rolandw.dev/pages?${pagination}`;
	}

	console.log(`fetching items ${url}`);
	return fetch(url, { method: "get" });
};