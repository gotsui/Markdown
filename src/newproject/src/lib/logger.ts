import path from "path";
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const logLevel = process.env.PINO_LOG_LEVEL || (isProduction ? "info" : "debug");
const logFilePath = path.join(process.cwd(), "logs/app.log");

const logger = pino({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level: (label: string) => {
            return {
                level: label,
            };
        },
    },
    transport: {
        target: "pino/file",
        options: {
            destination: logFilePath,
            mkdir: true
        },
    },
    browser: {
        asObject: true,
        serialize: true,
    },
});

export default logger;