import { Service } from "typedi";
import { ICandidate } from "../models/candidates.model";
import CandidatesServices from "./candidates.services";
import SessionsServices from "./sessions.services";
import PaymentRepo from "../repositories/payments.repository";
import { CreatePayment } from "../schemas/payments.schemas";
import { IntouchServices } from "./mobile";

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
    phone
  }: {
    amount: number;
  } & CreatePayment["body"]) {
    // Ensure both candidate and session do exist and are valid
    await this.sessionService.getSession({ sessionId: session });
    const candidate = await this.candidateService.getCandidate({ publicId });

    const { firstname, lastname } = candidate as ICandidate;

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

    return { paymentRef };
  }
}
