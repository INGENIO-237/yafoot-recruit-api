import { Service } from "typedi";
import WaitlistRepo from "../repositories/waitlist.repository";
import { RegisterToWaitlist } from "../schemas/waitlist.schemas";
import CandidatesServices from "./candidates.services";
import ApiError from "../utils/errors/errors.base";
import { HTTP } from "../utils/constants/common";

@Service()
export default class WaitlistServices {
  constructor(
    private repository: WaitlistRepo,
    private CandidatesServices: CandidatesServices
  ) {}

  async getWaitlist() {
    return await this.repository.getWaitlist();
  }

  async getFromWaitlist(candidateId: string) {
    return await this.repository.getFromWaitlist(candidateId);
  }

  async registerToWaitlist({ publicId }: RegisterToWaitlist["body"]) {
    const candidate = await this.CandidatesServices.getCandidate({
      publicId,
    });

    const candidateId = candidate?._id.toString() as string;

    const alreadyRegistered = await this.getFromWaitlist(candidateId);

    if (alreadyRegistered) {
      throw new ApiError(
        "Already registered to the waitlist",
        HTTP.BAD_REQUEST
      );
    }

    return await this.repository.registerToWaitlist(
      candidate?._id.toString() as string
    );
  }

  async removeFromWaitlist(candidateId: string) {
    await this.repository.removeFromWaitlist(candidateId);
  }
}
