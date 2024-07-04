import "reflect-metadata";

import express from "express";
import router from "../router";
import connectToDb from "./db";
import errorHandler from "../utils/errors/errors.handler";
import cors from "cors";
import Container from "typedi";
import CardsServices from "../services/cards.services";

export default function createServer() {
  const server = express();

  //   Connect to DB
  (async () => await connectToDb())();

  //  Middlewares
  server.use(express.json());

  const card = Container.get(CardsServices);

  card.generateQrCode({ data: "Test QR CODE 1234567", name: "1" });
  card.generateQrCode({ data: "Test QR CODE 1234567", name: "2" });
  card.generateQrCode({ data: "Test QR CODE 1234567", name: "3" });
  card.generateQrCode({ data: "Test QR CODE 1234567", name: "4" });

  //  Cors
  server.use(cors());

  //  Router
  router(server);

  //  Error handling
  server.use(errorHandler);

  return server;
}
