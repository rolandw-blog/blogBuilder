import App from "./app";
import Route from "./interfaces/routes.interface";
import IndexRoute from "./routes/index.route";
import PageNotFound from "./routes/pageNotFound.route";
import validateEnv from "./utils/validateEnv";
import loggerFunction from "./utils/genericLogger";
const logger = loggerFunction(__filename);
import dotenv from "dotenv";
import BuildRoute from "./routes/build.route";
import BuildAllRoute from "./routes/buildAll.route";
dotenv.config();

logger.info("Starting up");

if (validateEnv() === false) {
	throw new Error("Environment was not correctly set up");
} else {
	logger.debug("environment validated successful");
}

function start() {
	// We get the Route[] interface and use that to craft the IndexRoute
	// The array of routes is passed into the App
	const routes: Route[] = [new IndexRoute(), new BuildRoute(), new BuildAllRoute()];

	// push the last route which is a 404 page
	routes.push(new PageNotFound());

	// then create the app and start listening on the port
	new App(routes, { port: process.env["PORT"] as string }).listen();
}

start();
