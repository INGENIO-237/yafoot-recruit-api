// import "reflect-metadata";

import mongoose from "mongoose";
import config from "../config";
import logger from "../utils/logger";
import { ENV } from "../utils/constants/common";
// import Container from "typedi";
// import CardsServices from "../services/cards.services";

const ATTEMPTS = 5;
let retries = 5;
let timeout: NodeJS.Timeout;

export default async function connectToDb() {
  try {
    logger.info(
      `Connecting to DB: ${config.APP_ENV !== ENV.PROD && config.DB_URI}`
    );
    mongoose.connect(config.DB_URI).then(async () => {
      logger.info("Connected to DB");
      // const card = Container.get(CardsServices);

      // await card.generateCard("ref-14fc6e15-0203-4339-8533-7af908d3c297");
    });
  } catch (error: any) {
    if (retries > 0) {
      retries -= 1;
      logger.error(
        `Failed to connect to DB. Retrying... ${ATTEMPTS - retries}/${ATTEMPTS}`
      );
      timeout = setTimeout(async () => await connectToDb(), 5000);
    } else {
      logger.error("Failed to connect to DB.");
      logger.error(error.message);
      clearTimeout(timeout);
      process.exit();
    }
  }
}
