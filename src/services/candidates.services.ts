import { Service } from "typedi";
import CandidateRepo from "../repositories/candidates.repository";
import ApiError from "../utils/errors/errors.base";
import { HTTP } from "../utils/constants/common";
import { RegisterCandidate } from "../schemas/candidates.schemas";

@Service()
export default class CandidateService {
  constructor(private repository: CandidateRepo) {}

  async registerCandidate(payload: RegisterCandidate["body"]) {
    return await this.repository.registerCandidate(payload);
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
