import { Service } from "typedi";
import Candidate from "../models/candidates.model";
import { Types } from "mongoose";
import { RegisterCandidate } from "../schemas/candidates.schemas";

@Service()
export default class CandidateRepo {
  async registerCandidate(payload: RegisterCandidate["body"]) {
    return await Candidate.create(payload);
  }

  async getCandidate({
    candidateId,
    publicId,
  }: {
    candidateId?: string;
    publicId?: string;
  }) {
    return await Candidate.findOne({
      $or: [{ _id: new Types.ObjectId(candidateId) }, { publicId }],
    });
  }
}
