import createServer from "./base/server";
import config from "./config";
import logger from "./utils/logger";

const server = createServer();

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
