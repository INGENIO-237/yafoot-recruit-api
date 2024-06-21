import { config } from "dotenv";
import { ENV } from "./utils/constants/common";

config();

export default {
  APP_ENV: process.env.APP_ENV,
  PORT: process.env.PORT ?? 8000,
  DB_URI: process.env.ATLAS as string,
  // DB_URI: (process.env.APP_ENV === ENV.PROD
  //   ? process.env.ATLAS
  //   : process.env.COMPASS) as string,
};
