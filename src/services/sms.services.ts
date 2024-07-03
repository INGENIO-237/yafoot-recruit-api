import { Service } from "typedi";
import TwilioService from "./twilio.services";

@Service()
export default class SmsServices {
  constructor(private twilio: TwilioService) {}

  async sendPkSms({
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

  async sendNewSessionCreatedSms({
    firstname,
    lastname,
    phone,
    publicId,
    date,
  }: {
    firstname?: string;
    lastname: string;
    phone: string;
    publicId: string;
    date: string;
  }) {
    const formattedDate = new Date(date).toLocaleDateString();

    await this.twilio.sendSms({
      message: `Hello ${firstname} ${lastname},\n A new recruitment session has been planned for ${formattedDate}.\nHere is your public ID from Yafoot-recruit: ${publicId}.\nUse it to pay your participation fees.`,
      recipient: phone,
    });
  }
}
