const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

// Define log format
const logFormat = combine(
	colorize(),
	timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	printf(({ level, message, timestamp }) => {
		return `[${timestamp}] ${level}: ${message}`;
	})
);

// Create logger instance
const logger = createLogger({
	format: logFormat,
	transports: [
		new transports.Console(),
		new transports.File({
			filename: "error.log",
			level: "error",
		}),
		new transports.File({ filename: "combined.log" }),
	],
});

module.exports = logger;
