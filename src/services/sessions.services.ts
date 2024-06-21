import { Service } from "typedi";
import SessionsRepo from "../repositories/sessions.repository";
import { CreateSession } from "../schemas/sessions.schemas";
import SessionsEvents from "../hooks/sessions.hooks";
import { SESSIONS } from "../utils/constants/hooks";

@Service()
export default class SessionsServices {
  constructor(private repository: SessionsRepo) {}

  async createSession({ date }: CreateSession["body"]) {
    const session = await this.repository.createSession({ date });

    SessionsEvents.emit(SESSIONS.CREATED);

    return session;
  }

  async getSessions() {
    return await this.repository.getSessions();
  }
}
