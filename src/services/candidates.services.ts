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
    const candidate = await this.repository.registerCandidate(payload);

    CandidatesEvents.emit(CANDIDATES.REGISTERED, candidate);

    return candidate;
  }

  async getCandidate({
    candidateId,
    publicId,
    raiseException = true,
  }: {
    candidateId?: string;
    publicId?: string;
    raiseException?: boolean;
  }) {
    const candidate = await this.repository.getCandidate({
      candidateId,
      publicId: "YA-" + publicId,
    });

    if (raiseException && !candidate) {
      throw new ApiError("Candidate not found", HTTP.NOT_FOUND);
    }

    return candidate;
  }
}
