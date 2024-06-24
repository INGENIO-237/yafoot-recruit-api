import { Service } from "typedi";
import { ICandidate } from "../models/candidates.model";
import { PROVIDER } from "../utils/constants/payments";
import CandidatesServices from "./candidates.services";
import IntouchServices from "./mobile/intouch.services";
import SessionsServices from "./sessions.services";
import PaymentRepo from "../repositories/payments.repository";

@Service()
export default class PaymentsService {
  constructor(
    private repository: PaymentRepo,
    private candidateService: CandidatesServices,
    private sessionService: SessionsServices,
    private intouch: IntouchServices
  ) {}

  async initializePayment({
    amount,
    publicId,
    session,
    provider,
  }: {
    amount: number;
    publicId: string;
    session: string;
    provider: PROVIDER;
  }) {
    // Ensure both candidate and session do exist and are valid
    await this.sessionService.getSession({ sessionId: session });
    const candidate = await this.candidateService.getCandidate({ publicId });

    const { firstname, lastname, phone } = candidate as ICandidate;

    // Initialize payment
    const { reference } = await this.intouch.initializePayment({
      firstname: firstname as string | undefined,
      lastname,
      phone,
      provider,
      amount,
    });

    // Persist initialized payment
    const { paymentRef } = await this.repository.initializePayment({
      session,
      candidate: publicId,
      amount,
      provider,
      reference,
    });

    return {paymentRef};
  }
}
