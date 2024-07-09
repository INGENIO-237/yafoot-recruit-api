import { Service } from "typedi";
import Waitlist from "../models/waitlist.model";
import { Types } from "mongoose";

@Service()
export default class WaitlistRepo {
  async registerToWaitlist(candidateId: string) {
    return await Waitlist.create({ candidate: candidateId });
  }

  async getFromWaitlist(candidateId: string) {
    return await Waitlist.findOne({ candidate: candidateId });
  }

  async getWaitlist() {
    return await Waitlist.find();
  }

  async removeFromWaitlist(candidateId: string) {
    await Waitlist.findOneAndDelete({
      candidate: new Types.ObjectId(candidateId),
    });
  }
}
