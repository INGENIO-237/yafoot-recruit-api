import { Service } from "typedi";
import TwilioService from "./twilio.services";

@Service()
export default class SmsService {
  constructor(private twilio: TwilioService) {}

  async sendNewRegistrationSms({
    firstname,
    lastname,
    phone,
    publicId,
  }: {
    firstname?: string;
    lastname: string;
    phone: string;
    publicId: string;
  }) {
    await this.twilio.sendSms({
      message: `Hello ${firstname} ${lastname},\n Here is your public ID from Yafoot-recruit: ${publicId}.\nUse it to pay your participation fees.`,
      recipient: phone,
    });
  }
}
