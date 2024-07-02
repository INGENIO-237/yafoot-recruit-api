import { config } from "dotenv";
import { ENV } from "./utils/constants/common";

config();

export default {
  APP_ENV: process.env.APP_ENV,
  PORT: process.env.PORT ?? 8000,
  // DB_URI: process.env.ATLAS as string,
  APPLICATION_FEES: process.env.APPLICATION_FEES as unknown as number,
  DB_URI: (process.env.APP_ENV === ENV.PROD
    ? process.env.ATLAS
    : process.env.COMPASS) as string,

  // TWILIO
  TWILIO_SID: process.env.TWILIO_SID as string,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER as string,

  // INTOUCH
  INTOUCH_URI: process.env.INTOUCH_URI as string,
  INTOUCH_USERNAME: process.env.INTOUCH_USERNAME as string,
  INTOUCH_PWD: process.env.INTOUCH_PWD as string,
  INTOUCH_CALLBACK: process.env.INTOUCH_CALLBACK as string,
};
