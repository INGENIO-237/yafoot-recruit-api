import { createLogger, format, transports } from "winston";
import { ENV } from "./constants/common";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

if (process.env.APP_ENV !== ENV.PROD) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
} else {
  logger.add(
    new transports.File({
      filename: "yafoot-recruit-error.log",
      level: "error",
    })
  );
  logger.add(
    new transports.File({
      filename: "yafoot-recruit-trace.log",
      level: "info",
    })
  );
}

export default logger;
