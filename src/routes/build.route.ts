// This is just ONE route. A new file is created for every route
// The Route contains an indexController which is a standard-ish MVC controller
// 	The job for IndexController is to actually run some code for the request
// 	In this case, the IndexController just returns 200 "OK"

import Ajv, { ValidateFunction } from "ajv";
import { NextFunction, Request, Response, Router } from "express";
import BuildController from "../controllers/builder.controller";
import Route from "../interfaces/routes.interface";
import validateRequest from "../middleware/validateReq.middleware";
import { RequestHandler } from "express";
import schema, { IQueryParams } from "../models/ajv/IQueryParams.schema";

class BuildRoute implements Route {
	public path = "/page";
	public router = Router({ strict: true });
	public controller: BuildController;
	private validator: ValidateFunction<IQueryParams>;
	private schema = schema;

	constructor() {
		this.validator = new Ajv().compile(this.schema);
		this.controller = new BuildController();
		this.initializeRoutes();
	}

	private middleware(): RequestHandler[] {
		return [validateRequest<IQueryParams>("query", this.validator)];
	}

	private initializeRoutes() {
		this.router.get(
			`${this.path}`,
			[...this.middleware()],
			(req: Request, res: Response, next: NextFunction) => {
				this.controller.build(req, res, next);
			}
		);
	}
}

export default BuildRoute;
