import type { Request, Response } from "express";

import { CreatePaymentRequestUseCase } from "../../application/use-cases/create-payment-request.usecase.js";

import { toPaymentRequestResponse } from "../../application/dto/create-payment-request.dto.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { GetMyPaymentRequestsUseCase } from "../../application/use-cases/get-my-payment-requests.usecase.js";
import type { CancelPaymentRequestUseCase } from "../../application/use-cases/cancel-payment-request.usecase.js";
import type { ExpirePendingPaymentRequestsUseCase } from "../../application/use-cases/expire-payment-request.usecase.js";

export class PaymentRequestController {
  constructor(
    private readonly createPaymentRequestUseCase: CreatePaymentRequestUseCase,
    private readonly getMyPaymentRequestsUseCase: GetMyPaymentRequestsUseCase,
    private readonly cancelPaymentRequestUseCase: CancelPaymentRequestUseCase,
    private readonly expirePendingPaymentRequestsUseCase: ExpirePendingPaymentRequestsUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const request = await this.createPaymentRequestUseCase.execute(
      req.authUser.userId,
      req.body,
    );

    sendSuccess(
      res,
      toPaymentRequestResponse(request),
      "Payment request created.",
      201,
    );
  }

  async getMyPaymentRequests(req: Request, res: Response): Promise<void> {
    const requests = await this.getMyPaymentRequestsUseCase.execute(
      req.authUser.userId,
    );

    sendSuccess(
      res,
      requests.map(toPaymentRequestResponse),
      "Payment requests retrieved successfully.",
      201,
    );
  }

  async cancelPaymentRequest(
    req: Request<{ paymentRequestId: string }>,
    res: Response,
  ): Promise<void> {
    const request = await this.cancelPaymentRequestUseCase.execute({
      paymentRequestId: req.params.paymentRequestId,
      merchantUserId: req.authUser.userId,
    });

    sendSuccess(
      res,
      toPaymentRequestResponse(request),
      "Payment request cancelled successfully.",
    );
  }

  async expirePendingPaymentRequests(_: Request, res: Response): Promise<void> {
    const expiredCount =
      await this.expirePendingPaymentRequestsUseCase.execute();

    sendSuccess(
      res,
      { expiredCount },
      `Successfully expired ${expiredCount} requests.`,
    );
  }
}
