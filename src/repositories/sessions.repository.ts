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

  async getLatestSession(date: Date) {
    return await Session.findOne({ date: { $gt: date } }).select("-createdAt -updatedAt -__v");
  }

  async getSession(sessionId: string) {
    return await Session.findById(sessionId);
  }
}
