import { Service } from "typedi";
import CandidateRepo from "../repositories/candidates.repository";
import ApiError from "../utils/errors/errors.base";
import { HTTP } from "../utils/constants/common";
import { RegisterCandidate } from "../schemas/candidates.schemas";
import CandidatesEvents from "../hooks/candidates.hooks";
import { CANDIDATES } from "../utils/constants/hooks";

@Service()
export default class CandidateService {
  constructor(private repository: CandidateRepo) {}

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
      publicId,
    });

    if (raiseException && !candidate) {
      throw new ApiError("Candidate not found", HTTP.NOT_FOUND);
    }
  }
}
