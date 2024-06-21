import { Service } from "typedi";
import SessionsServices from "../services/sessions.services";
import { Request, Response } from "express";
import { CreateSession } from "../schemas/sessions.schemas";
import { HTTP } from "../utils/constants/common";

@Service()
export default class SessionsController {
  constructor(private service: SessionsServices) {}

  async createSession(
    req: Request<{}, {}, CreateSession["body"]>,
    res: Response
  ) {
    const session = await this.service.createSession(req.body);

    return res.status(HTTP.CREATED).json(session);
  }

  async getSessions(req: Request, res: Response) {
    const sessions = await this.service.getSessions();

    return res.status(HTTP.OK).json(sessions);
  }
}
