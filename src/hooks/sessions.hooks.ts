import "reflect-metadata";

import EventEmitter from "node:events";
import { SESSIONS } from "../utils/constants/hooks";
import Container from "typedi";
import WaitlistServices from "../services/waitlist.services";
import SmsServices from "../services/sms.services";
import CandidatesServices from "../services/candidates.services";
import logger from "../utils/logger";

const SessionsEvents = new EventEmitter();

SessionsEvents.on(SESSIONS.CREATED, async (date: string) => {
  const waitlist = Container.get(WaitlistServices);
  const sms = Container.get(SmsServices);
  const candidatesServices = Container.get(CandidatesServices);

  try {
    const candidates = await waitlist.getWaitlist();

    candidates.forEach(async (candidate) => {
      const cndidate = await candidatesServices.getCandidate({
        candidateId: candidate._id.toString(),
        raiseException: false,
      });

      //   Send new session created notification
      if (cndidate) {
        const { firstname, lastname, publicId, phone } = cndidate;
        await sms.sendNewSessionCreatedSms({
          firstname: firstname as string,
          lastname,
          publicId: publicId as string,
          date,
          phone: phone as string,
        });
      }
    });
  } catch (error) {
    logger.error(error);
  }
});

export default SessionsEvents;
