import express from "express";
import router from "../router";
import connectToDb from "./db";
import errorHandler from "../utils/errors/errors.handler";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";

export default function createServer() {
  const server = express();

  //   Connect to DB
  (async () => await connectToDb())();

  //  Middlewares
  server.use(express.json());

  //  Cors
  server.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://yafoot-fc.com",
        "http://yafoot-fc.com",
        "https://admin.yafoot-fc.com",
        "http://admin.yafoot-fc.com",
      ],
    })
  );

  // Cloudinary
  cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_SECRET_KEY,
  });

  //  Router
  router(server);

  //  Error handling
  server.use(errorHandler);

  return server;
}
