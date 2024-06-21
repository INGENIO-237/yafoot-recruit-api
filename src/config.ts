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


  // TWILIO
  TWILIO_SID: process.env.TWILIO_SID as string,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER as string,
};
