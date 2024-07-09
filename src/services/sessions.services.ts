import { Service } from "typedi";
import SessionsRepo from "../repositories/sessions.repository";
import { CreateSession } from "../schemas/sessions.schemas";
import SessionsEvents from "../hooks/sessions.hooks";
import { SESSIONS } from "../utils/constants/hooks";
import ApiError from "../utils/errors/errors.base";
import { HTTP } from "../utils/constants/common";

@Service()
export default class SessionsServices {
  constructor(private repository: SessionsRepo) {}

  async createSession({ date }: CreateSession["body"]) {
    const onGoingSession = await this.getLatestSession();

    if (onGoingSession) {
      throw new ApiError(
        "Cannot create session while there's an ongoing one",
        HTTP.BAD_REQUEST
      );
    }

    if (!this.isValidDate(date)) {
      throw new ApiError(
        "Cannot create session with passed or today's date",
        HTTP.BAD_REQUEST
      );
    }

    const session = await this.repository.createSession({ date });

    SessionsEvents.emit(SESSIONS.CREATED);

    return session;
  }

  private isValidDate(date: string) {
    const d1 = new Date(date).getTime();
    const d2 = new Date().getTime(); // Today

    return d1 > d2;
  }

  async getSessions() {
    return await this.repository.getSessions();
  }

  async getLatestSession() {
    const now = new Date();
    return await this.repository.getLatestSession(now);
  }

  async getSession({
    sessionId,
    raiseException = true,
  }: {
    sessionId: string;
    raiseException?: boolean;
  }) {
    const session = await this.repository.getSession(sessionId);

    if (!session && raiseException) {
      throw new ApiError("Session does not exist", HTTP.NOT_FOUND);
    }

    return session;
  }
}
