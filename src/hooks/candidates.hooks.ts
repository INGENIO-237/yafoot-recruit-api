import "reflect-metadata";

import EventEmitter from "node:events";
import { CANDIDATES } from "../utils/constants/hooks";
import { ICandidate } from "../models/candidates.model";
import Container from "typedi";
import SmsServices from "../services/sms.services";
import logger from "../utils/logger";

const CandidatesEvents = new EventEmitter();
const sms = Container.get(SmsServices);

CandidatesEvents.on(
  CANDIDATES.REGISTERED,
  async ({ firstname, lastname, phone, publicId }: ICandidate) => {
    try {
      await sms.sendPkSms({
        firstname: firstname as string,
        lastname,
        phone,
        publicId: publicId as string,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

CandidatesEvents.on(
  CANDIDATES.EXISTING_PHONE,
  async ({ firstname, lastname, phone, publicId }: ICandidate) => {
    try {
      await sms.sendPkSms({
        firstname: firstname as string,
        lastname,
        phone,
        publicId: publicId as string,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);



export default CandidatesEvents;
