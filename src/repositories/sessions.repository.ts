import { Service } from "typedi";
import { CreateSession } from "../schemas/sessions.schemas";
import Session from "../models/sessions.model";

@Service()
export default class SessionsRepo {
  async createSession({ date }: CreateSession["body"]) {
    return await Session.create({ date });
  }

  async getSessions() {
    return await Session.find();
  }
}
