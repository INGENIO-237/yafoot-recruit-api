import "reflect-metadata";

import EventEmitter from "node:events";
import { PAYMENTS } from "../utils/constants/hooks";
import Container from "typedi";
import { ToolBoxServices } from "../services/mobile";
import { PAYMENT_STATUS } from "../utils/constants/payments";
import PaymentsService from "../services/payments.services";
import logger from "../utils/logger";

const PaymentsHooks = new EventEmitter();

PaymentsHooks.on(PAYMENTS.INITIALIZED, (reference: string) => {
  let timeout = 1000 * 60 * 10; // 10 minutes
  let exit = false;
  const INTERVAL_TIME = 30000; // 30 secondes

  const paymentService = Container.get(PaymentsService);
  const toolbox = Container.get(ToolBoxServices);

  // console.log({ reference });

  const interval = setInterval(async (): Promise<void> => {
    timeout -= INTERVAL_TIME;
    // console.log("Verifying payment status...");

    try {
      const { status } = await toolbox.getPayment(reference);
      if (
        Object.values(PAYMENT_STATUS).includes(status as PAYMENT_STATUS) &&
        status != PAYMENT_STATUS.INITIALIZED
      ) {
        // Update status accordingly
        await paymentService.updatePayment({
          reference,
          status: status as PAYMENT_STATUS,
        });
        exit = true;
      }

      if (status == PAYMENT_STATUS.SUCCEEDED) {
        // Emit PAYMENTS.SUCCEEDED event to automatically create candidate's card
        PaymentsHooks.emit(PAYMENTS.SUCCEEDED, reference);
      }

      if (timeout < 1 || exit) clearInterval(interval);
    } catch (error) {
      logger.error(error);
    }
  }, INTERVAL_TIME);
});

PaymentsHooks.on(PAYMENTS.SUCCEEDED, (reference: string) => {
  // TODO: Generate candidate's card and send him the link via SMS
  console.log("Generate card for payment: " + reference);
});

export default PaymentsHooks;
