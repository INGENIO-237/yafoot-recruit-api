import { Request, Response } from "express";
import WaitlistServices from "../services/waitlist.services";
import { HTTP } from "../utils/constants/common";
import { RegisterToWaitlist } from "../schemas/waitlist.schemas";
import { Service } from "typedi";

@Service()
export default class WaitlistController {
  constructor(private service: WaitlistServices) {}

  async getWaitlist(req: Request, res: Response) {
    const waitlist = await this.service.getWaitlist();

    return res.status(HTTP.OK).json(waitlist);
  }

  async registerToWaitlist(
    req: Request<{}, {}, RegisterToWaitlist["body"]>,
    res: Response
  ) {
    const registration = await this.service.registerToWaitlist(req.body);

    return res.status(HTTP.CREATED).json(registration);
  }
}
