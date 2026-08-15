import type { NextFunction, Request, Response } from "express";

import { CreatePaymentRequestUseCase } from "../../application/use-cases/create-payment-request.usecase.js";

import { toPaymentRequestResponse } from "../../application/dto/payment-request.dto.js";

export class PaymentRequestController {
  constructor(
    private readonly createPaymentRequestUseCase: CreatePaymentRequestUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = await this.createPaymentRequestUseCase.execute(
        req.authUser!.userId,
        req.body,
      );

      res.status(201).json({
        success: true,
        data: toPaymentRequestResponse(request),
      });
    } catch (error) {
      next(error);
    }
  }
}
