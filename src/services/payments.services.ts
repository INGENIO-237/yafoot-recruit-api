import { Service } from "typedi";
import CandidatesServices from "./candidates.services";
import SessionsServices from "./sessions.services";
import PaymentRepo from "../repositories/payments.repository";
import { CreatePayment } from "../schemas/payments.schemas";
import { ToolBoxServices } from "./mobile";
import { PAYMENT_STATUS } from "../utils/constants/payments";
import PaymentsHooks from "../hooks/payments.hooks";
import { PAYMENTS } from "../utils/constants/hooks";
import ApiError from "../utils/errors/errors.base";
import { HTTP } from "../utils/constants/common";

@Service()
export default class PaymentsService {
  constructor(
    private repository: PaymentRepo,
    private candidateService: CandidatesServices,
    private sessionService: SessionsServices,
    private toolbox: ToolBoxServices
  ) {}

  async initializePayment({
    amount,
    publicId,
    session,
    provider,
    phone,
  }: {
    amount: number;
  } & CreatePayment["body"]) {
    // Ensure both candidate and session do exist and are valid
    await this.sessionService.getSession({ sessionId: session });
    const candidate = await this.candidateService.getCandidate({ publicId });

    // Initialize payment
    const { reference, authorization_url } =
      await this.toolbox.initializePayment({
        phone,
        provider,
        amount,
      });

    // Persist initialized payment
    await this.repository.initializePayment({
      session,
      candidate: candidate?._id.toString() as string,
      amount,
      provider,
      reference,
    });

    // Emit PAYMENT.INITIALIZED event to constantly check payment status
    PaymentsHooks.emit(PAYMENTS.INITIALIZED, reference);

    return { paymentRef: reference, authorization_url };
  }

  async updatePayment({
    reference,
    status,
  }: {
    reference: string;
    status: PAYMENT_STATUS;
  }) {
    await this.repository.updatePayment({ reference, status });
  }

  async getPayment({
    reference,
    id,
    raiseException = false,
  }: {
    reference?: string;
    id?: string;
    raiseException?: boolean;
  }) {
    const payment = await this.repository.getPayment({ reference, id });

    if (!payment && raiseException) {
      throw new ApiError("Payment not found", HTTP.NOT_FOUND);
    }

    return payment;
  }
}
