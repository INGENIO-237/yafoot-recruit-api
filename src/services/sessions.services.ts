import { Service } from "typedi";
import SessionsRepo from "../repositories/sessions.repository";
import { CreateSession } from "../schemas/sessions.schemas";

@Service()
export default class SessionsServices {
  constructor(private repository: SessionsRepo) {}

  async createSession({ date }: CreateSession["body"]) {
    return await this.repository.createSession({ date });
  }

  async getSessions() {
    return await this.repository.getSessions();
  }
}
