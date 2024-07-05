import "reflect-metadata"

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

  const image = Container.get(CardsServices)
  image.generateQrCode({data:"YA-W69W", reference: "jdjdkhdwhkhwkkw"})
  image.buildCardRecto("jdjdkhdwhkhwkkw", "fr")

  //  Cors
  server.use(cors());

  //  Router
  router(server);

  //  Error handling
  server.use(errorHandler);

  return server;
}
