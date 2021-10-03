// eslint-disable-next-line node/no-unpublished-import
import dailyRotateFile from "winston-daily-rotate-file";

const fileRotatorTransport = new dailyRotateFile({
	// https://github.com/winstonjs/winston-daily-rotate-file
	filename: "application-%DATE%.log",
	datePattern: "YYYY-MM-DD-HH",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
	dirname: "src/logs",
});

export default fileRotatorTransport;
