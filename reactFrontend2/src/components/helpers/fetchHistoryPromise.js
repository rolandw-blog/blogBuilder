export default async (_id) => {
	const url = `https://watch.rolandw.dev/history/find/${_id}`;

	console.log(`fetching items /history/find/${_id}`);
	return fetch(url, { method: "get" });
};
