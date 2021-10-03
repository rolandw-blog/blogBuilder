import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import Route from "./interfaces/routes.interface";
import loggerFunction from "./utils/genericLogger";
const logger = loggerFunction(__filename);
import httpExceptionMiddleware from "./middleware/httpException.middleware";
import openapiSpecification from "./swagger";
import AppOptions from "./interfaces/appOptions.interface";
import { Server } from "http";
import errorMiddleware from "./middleware/error.middleware";

class App {
	// List all the fields that this class will contain
	// Note that routes passed to the controller does not exist here
	// 	Thats because the routes are consumer immediately by initializeRoutes and attached to the app at runtime
	public app: express.Application;
	public port: string;
	public env: boolean;

	constructor(routes: Route[], options: AppOptions = { port: "3001" }) {
		this.app = express();
		this.port = options.port;
		this.env = process.env["NODE_ENV"] === "production" ? true : false;

		this.initializeMiddlewares();
		this.initilizeDocs();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	public listen(): Server {
		const server = this.app.listen(this.port, () => {
			logger.debug(`App listening on the port ${this.port}`);
		});

		// return the server to close it later (in tests)
		return server;
	}

	public getServer(): express.Application {
		return this.app;
	}

	private initializeMiddlewares() {
		// quick and dirty logger
		// adding an underscore to res makes it an "uninteresting" param and will be ignored by tslint
		this.app.use((req: Request, _: Response, next: NextFunction) => {
			logger.info(req.url);
			next();
		});

		if (this.env) {
			logger.info("running in production");
			this.app.use(helmet());
			this.app.use(cors({ origin: `${process.env["DOMAIN"]}`, credentials: true }));
		} else {
			this.app.use(cors({ origin: true, credentials: true }));
		}

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	// Create the swagger UI for openapi documentation
	// This step MUST come before the initialize routes
	private initilizeDocs() {
		this.app.get("/api-docs", (_req: Request, res: Response) => {
			res.status(200).json(openapiSpecification);
		});
	}

	// consume the routes and add them to the app
	private initializeRoutes(routes: Route[]) {
		routes.forEach((route) => {
			this.app.use("/", route.router);
		});
	}

	// This should be initilized last to catch any errors
	// This will also be hit if you have not implemented a 404 page
	private initializeErrorHandling() {
		this.app.use(httpExceptionMiddleware);

		// Optionally you can enable this error middleware to catch errors of generic type Error (instead of just HTTP exceptions)
		// 		This is possible because the httpExceptionMiddleware will pass any error on if its not a httpException
		if (process.env["NODE_ENV"] == "production") {
			this.app.use(errorMiddleware);
		}
	}
}

export default App;
