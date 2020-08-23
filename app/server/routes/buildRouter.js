const debug = require("debug")("blogWatcher:buildRouter");

/**
 * Appends routes to the router object
 * @param {Router} router - Express router object
 * @param {Array} routes - An array of routes
 */
const buildRouter = (router, routes) => {
	debug(`got ${routes.length} routes to build`);
	// for each route in the provided routes array
	for (let i in routes) {
		debug(`building route ${routes[i].path}`);
		// build the route like you would one by one
		// EG: router.get("/image/meta/:id", getImageMeta);
		router[routes[i].method](
			routes[i].path,
			routes[i].middleware,
			routes[i].handler
		);
		router.stack[i].helpDescription = routes[i].help;
	}

	return router;
};

module.exports = buildRouter;
