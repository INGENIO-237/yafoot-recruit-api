import { Service } from "typedi";
import CandidatesRepo from "../repositories/candidates.repository";
import ApiError from "../utils/errors/errors.base";
import { HTTP } from "../utils/constants/common";
import { RegisterCandidate } from "../schemas/candidates.schemas";
import CandidatesEvents from "../hooks/candidates.hooks";
import { CANDIDATES } from "../utils/constants/hooks";

@Service()
export default class CandidatesServices {
  constructor(private repository: CandidatesRepo) {}

  async getCandidates() {
    return await this.repository.getCandidates();
  }

  async registerCandidate(payload: RegisterCandidate["body"]) {
    /**
     * Look for existing candidate with the same phone number
     * If any, emit EXISTING_PHONE event, send pk ID via SMS
     * And throw an `Already in use` error
     */
    const existingCandidate = await this.repository.getCandidate({
      phone: payload.phone,
    });

    if (existingCandidate) {
      CandidatesEvents.emit(CANDIDATES.EXISTING_PHONE, existingCandidate);

      throw new ApiError(
        "Phone number already in use. If this is yours, an SMS has been sent to you with your Public ID.",
        HTTP.BAD_REQUEST
      );
    }

    const candidate = await this.repository.registerCandidate(payload);

    CandidatesEvents.emit(CANDIDATES.REGISTERED, candidate);

    return candidate;
  }

  async getCandidate({
    candidateId,
    publicId,
    phone,
    raiseException = true,
  }: {
    candidateId?: string;
    publicId?: string;
    phone?: string;
    raiseException?: boolean;
  }) {
    const candidate = await this.repository.getCandidate({
      candidateId,
      publicId: "YA-" + publicId,
      phone,
    });

    if (raiseException && !candidate) {
      throw new ApiError("Candidate not found", HTTP.NOT_FOUND);
    }

    return candidate;
  }
}
