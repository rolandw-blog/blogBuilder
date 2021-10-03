import { NextFunction, Request, Response, RequestHandler } from "express";
import { ValidateFunction } from "ajv";
import HttpException from "../exceptions/HttpException";
// import Ajv from "ajv/dist/core";

type Value = "body" | "query" | "params";

// when we call this we need to tell it the type for the validate function
// for example in user.route.ts: `validateRequest<UserRequest>("params", new Ajv().compile(mySchema);)`
function validationMiddleware<Type>(
	value: Value,
	validate: ValidateFunction<Type>
): RequestHandler {
	// This is sort of like a factory pattern that returns some middleware function that can validate any <Type> of schema passed to it.
	return (req: Request, _: Response, next: NextFunction) => {
		const isValid = validate(req[value]);
		if (isValid) {
			next();
		} else {
			next(
				new HttpException(400, `wrong ${value} from validate middleware`, validate.errors)
			);
		}
	};
}

export default validationMiddleware;
