import { Service } from "typedi";
import WaitlistRepo from "../repositories/waitlist.repository";
import { RegisterToWaitlist } from "../schemas/waitlist.schemas";
import CandidateService from "./candidates.services";

@Service()
export default class WaitlistServices {
  constructor(
    private repository: WaitlistRepo,
    private candidateService: CandidateService
  ) {}

  async getWaitlist() {
    return await this.repository.getWaitlist();
  }

  async registerToWaitlist({ publicId }: RegisterToWaitlist["body"]) {
    const candidate = await this.candidateService.getCandidate({
      publicId: "YA-" + publicId,
    });

    return await this.repository.registerToWaitlist(
      candidate?._id.toString() as string
    );
  }
}
