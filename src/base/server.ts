import "reflect-metadata";

import express from "express";
import router from "../router";
import connectToDb from "./db";
import errorHandler from "../utils/errors/errors.handler";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import Container from "typedi";
import CardsServices from "../services/cards.services";

export default function createServer() {
  const server = express();

  //   Connect to DB
  (async () => await connectToDb())();

  //  Middlewares
  server.use(express.json());

  // Cloudinary
  cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_SECRET_KEY,
  });

  const image = Container.get(CardsServices);
  // image.generateCard("ref-c3c07bff-4005-423c-9f26-57055e57b5d0");

  //  Cors
  server.use(cors());

  //  Router
  router(server);

  //  Error handling
  server.use(errorHandler);

  return server;
}
