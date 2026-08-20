import type { Request, Response } from "express";

import { ApprovePaymentRequestUseCase } from "../../application/use-cases/approve-payment-request.usecase.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import { StatusCodes } from "http-status-codes";
import { PaymentExecutionPresenter } from "../presenter/payment-execution.presenter.js";

export class PaymentExecutionController {
  constructor(
    private readonly approvePaymentRequestUseCase: ApprovePaymentRequestUseCase,
  ) {}

  async approve(
    req: Request<{ paymentRequestId: string }>,
    res: Response,
  ): Promise<void> {
    const transaction = await this.approvePaymentRequestUseCase.execute(
      req.authUser!.userId,
      req.params.paymentRequestId,
    );

    sendSuccess(
      res,
      PaymentExecutionPresenter.toResponse(transaction),
      "Payment approved and completed!",
      StatusCodes.CREATED,
    );
  }
}
