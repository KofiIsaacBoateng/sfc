import type { NextFunction, Request, Response } from "express";

import { CreatePaymentRequestUseCase } from "../../application/use-cases/create-payment-request.usecase.js";

import { toPaymentRequestResponse } from "../../application/dto/create-payment-request.dto.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";

export class PaymentRequestController {
  constructor(
    private readonly createPaymentRequestUseCase: CreatePaymentRequestUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const request = await this.createPaymentRequestUseCase.execute(
      req.authUser.userId,
      req.body,
    );

    sendSuccess(
      res,
      toPaymentRequestResponse(request),
      "Payment request created!",
      201,
    );
  }
}
