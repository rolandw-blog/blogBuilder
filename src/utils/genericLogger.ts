/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

/* eslint-disable node/no-unpublished-import */
import winston from "winston";
import consoleTransport from "./transports/console";
import ConsoleTimestampTransport from "./transports/consoleTimestamp";
import logLevels from "./logLevels";
import path from "path";

// ##──── GENERIC LOGGER ────────────────────────────────────────────────────────────────────

// Because this generic logger does not have a {level: info|warn|error|etc} field, it will trigger for every single winston log level event

// this logger function takes a filepath to log out some custom text
export default (filepath: string): winston.Logger => {
	// get the filename from the filepath
	const filename = path.basename(filepath);

	// create the logger
	const genericLogger = winston.createLogger({
		// we add transports in the switch below
		transports: [],
		// the log levels are defined in the logLevels.ts file
		levels: logLevels,
		// the defaultMeta is added to transports arguments.
		// IE when we call gernericLogger.add(consoleTransport) it will add the defaultMeta as arguments to the consoleTransport
		defaultMeta: { filename: filename },
		// the highest log level to log on. when set to debug it will log everything debug and above (everything)
		level: process.env["LOG_LEVEL"] || "debug",
	});

	switch (process.env["NODE_ENV"]) {
		case "development":
			genericLogger.add(consoleTransport);
			break;

		case "production":
			genericLogger.add(ConsoleTimestampTransport);
			break;

		default:
			// This is a dead (silent: true) logger that just exists as a backup if there is no transports defined
			// The purpose of this is because if we are not running in development or production (IE process.env.NODE_ENV === "test")
			// 		Then we decide to just log nothing at all
			// genericLogger.add(
			// 	new winston.transports.Console({
			// 		silent: true,
			// 	})
			// );
			genericLogger.add(consoleTransport);
			break;
	}

	return genericLogger;
};
