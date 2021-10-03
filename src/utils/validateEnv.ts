import loggerFunction from "./genericLogger";
const logger = loggerFunction(__filename);

const validateEnv = function (): boolean {
	const errors: Array<string> = [];
	const e = process.env;

	const expectedEnv = ["NODE_ENV", "DOMAIN", "LOG_LEVEL", "DB_API"];

	for (const envVar of expectedEnv) {
		if (typeof e[envVar] === "undefined") errors.push(`${envVar} is not defined`);
	}

	for (const err in errors) {
		logger.error(err);
	}

	if (errors.length > 0) return false;
	else return true;
};

export default validateEnv;
