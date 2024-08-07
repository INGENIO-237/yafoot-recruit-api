import { config } from "dotenv";
import { ENV } from "./utils/constants/common";

config();

export default {
  APP_ENV: process.env.APP_ENV,
  PORT: process.env.PORT ?? 8000,
  // DB_URI: process.env.ATLAS as string,
  APPLICATION_FEES: Number(process.env.APPLICATION_FEES as string),
  DB_URI: (process.env.APP_ENV === ENV.PROD
    ? process.env.ATLAS
    : process.env.COMPASS) as string,

  // TWILIO
  TWILIO_SID: process.env.TWILIO_SID as string,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER as string,

  // TOOLBOX
  TOOLBOX_URI: (process.env.APP_ENV === ENV.PROD
    ? process.env.TOOLBOX_URI_LIVE
    : process.env.TOOLBOX_URI_TEST) as string,
  TOOLBOX_API_KEY: (process.env.APP_ENV === ENV.PROD
    ? process.env.TOOLBOX_API_KEY_LIVE
    : process.env.TOOLBOX_API_KEY_TEST) as string,

  // CLOUDINARY
  CLOUDINARY_NAME: (process.env.APP_ENV === ENV.PROD
    ? process.env.CLOUDINARY_NAME_LIVE
    : process.env.CLOUDINARY_NAME_TEST) as string,
  CLOUDINARY_API_KEY: (process.env.APP_ENV === ENV.PROD
    ? process.env.CLOUDINARY_API_KEY_LIVE
    : process.env.CLOUDINARY_API_KEY_TEST) as string,
  CLOUDINARY_SECRET_KEY: (process.env.APP_ENV === ENV.PROD
    ? process.env.CLOUDINARY_SECRET_KEY_LIVE
    : process.env.CLOUDINARY_SECRET_KEY_TEST) as string,
};
