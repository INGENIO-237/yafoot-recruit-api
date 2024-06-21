import { Service } from "typedi";
import Waitlist from "../models/waitlist.model";

@Service()
export default class WaitlistRepo {
  async registerToWaitlist(candidateId: string) {
    return await Waitlist.create({ candidate: candidateId });
  }

  async getWaitlist() {
    return await Waitlist.find();
  }
}
