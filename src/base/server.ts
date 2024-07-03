import express from "express";
import router from "../router";
import connectToDb from "./db";
import errorHandler from "../utils/errors/errors.handler";
import cors from "cors";

export default function createServer() {
  const server = express();

  //   Connect to DB
  (async () => await connectToDb())();

  //  Middlewares
  server.use(express.json());

  //  Cors
  server.use(cors());

  //  Router
  router(server);

  //  Error handling
  server.use(errorHandler);

  return server;
}
