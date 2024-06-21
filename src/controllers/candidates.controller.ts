import { Service } from "typedi";
import CandidateService from "../services/candidates.services";
import { Request, Response } from "express";
import { HTTP } from "../utils/constants/common";
import { GetCandidate, RegisterCandidate } from "../schemas/candidates.schemas";

@Service()
export default class CandidatesController {
  constructor(private service: CandidateService) {}

  async getCandidates(req: Request, res: Response) {
    const candidates = await this.service.getCandidates();

    return res.status(HTTP.OK).json(candidates);
  }

  async registerCandidate(
    req: Request<{}, {}, RegisterCandidate["body"]>,
    res: Response
  ) {
    const candidate = await this.service.registerCandidate(req.body);
    return res.status(HTTP.CREATED).json(candidate);
  }

  async getCandidate(req: Request<GetCandidate["params"]>, res: Response) {
    const candidate = await this.service.getCandidate({
      candidateId: req.params.candidateId,
    });

    return res.status(HTTP.OK).json(candidate);
  }
}
