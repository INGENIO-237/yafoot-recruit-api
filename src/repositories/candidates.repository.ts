import { Service } from "typedi";
import Candidate from "../models/candidates.model";
import { Types } from "mongoose";
import { RegisterCandidate } from "../schemas/candidates.schemas";

@Service()
export default class CandidatesRepo {
  async getCandidates() {
    return await Candidate.find();
  }

  async registerCandidate(payload: RegisterCandidate["body"]) {
    return await Candidate.create(payload);
  }

  async getCandidate({
    candidateId,
    publicId,
    phone,
  }: {
    candidateId?: string;
    publicId?: string;
    phone?: string;
  }) {
    return await Candidate.findOne({
      $or: [{ _id: new Types.ObjectId(candidateId) }, { publicId }, { phone }],
    });
  }
}
