/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

/* eslint-disable node/no-unpublished-import */
import fs from "fs";
import winston, { transport } from "winston";
import dailyRotateFile from "winston-daily-rotate-file";

const logDir = __dirname + "/../logs";

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

// ##──── LOG FORMATS ───────────────────────────────────────────────────────────────────────

const logFormat = winston.format.printf(
	({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

// ##──── TRANSPORTS ────────────────────────────────────────────────────────────────────────

// Store a generic list of transports
const transports: transport[] = [];

// Transport One
transports.push(
	// https://github.com/winstonjs/winston-daily-rotate-file
	new dailyRotateFile({
		filename: "application-%DATE%.log",
		datePattern: "YYYY-MM-DD-HH",
		zippedArchive: true,
		maxSize: "20m",
		maxFiles: "14d",
		dirname: "src/logs",
	})
);

// Transport Two
transports.push(new winston.transports.Console());

// ##──── INFO LEVEL SPECIFIC LOGGER ────────────────────────────────────────────────────────

// level			when logger.info() is called, this runs
// format			winston.format.printf, or winston.format.json, etc.
// 						winston.format.combine lets me pass the timestamp to the custom logFormat as well (as a param)
// defaultMeta		meta information included with the log
// transports		where is the file going. IE to the log rotator, and to the console
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(winston.format.timestamp(), logFormat),
	defaultMeta: { service: "user-service" },
	transports: transports,
});

// Add an additional transport to the project to log to the console as well
// We could also have specified this as a transport in the transports array
// logger.add(
// 	new winston.transports.Console({
// 		format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
// 	})
// );

export default logger;
