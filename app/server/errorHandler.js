const debug = require("debug")("staticFolio:CatchErrors");

/**
 * Catch errors and return them back to the client
 * @param {JSON} req
 * @param {JSON} res
 */
const errorHandler = (err, req, res) => {
	if (err) debug("some ERROR occurred:");
	console.error({
		message: err.message,
		error: err,
	});
	const statusCode = err.status || 500;
	let message = err.message || "Internal Server Error";

	debug(`Eror status: ${err.status}`);
	debug(`Status Code: ${statusCode}`);

	if (statusCode === 500) {
		message = "Internal Server Error";
	}
	res.status(statusCode).json({
		message: message,
		returnCode: statusCode,
		actualStatusCode: err.statusCode,
		query: req.query,
		route: req.route,
		err: {
			error: err,
			errorMessage: err.message,
		},
		url: {
			params: req.params,
			url: req.url,
			ogURL: req.originalUrl,
			baseURL: req.baseURL,
			hostname: req.hostname,
			path: req.path,
		},
		cookies: req.cookies,
	});
};

module.exports = errorHandler;
