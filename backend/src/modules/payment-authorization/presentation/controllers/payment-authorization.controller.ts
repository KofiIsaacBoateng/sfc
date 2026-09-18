import type { Request, Response } from "express";

import type { HandleSfcPaymentTapUseCase } from "../../application/use-cases/handle-sfc-payment-tap.usecase.js";
import type { BasicPaymentAuthorizationService } from "../../application/services/basic-payment-authorization.service.js";

import type { HandleSfcTapDto } from "../../application/dto/handle-sfc-tap.dto.js";
import {
  toPaymentAuthorizationResponse,
  type AuthorizeBasicPaymentDto,
} from "../../application/dto/authorize-basic-payment.dto.js";
import type { SecureSfcProof } from "@/modules/devices/application/ports/secure-sfc-proof-verifier.port.js";
import type { PaymentAuthorizationDuration } from "../../domain/entities/payment-authorization.entity.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import { StatusCodes } from "http-status-codes";

export class PaymentAuthorizationController {
  constructor(
    private readonly handleSfcPaymentTapUseCase: HandleSfcPaymentTapUseCase,
    private readonly basicPaymentAuthorizationService: BasicPaymentAuthorizationService,
  ) {}

  async handleTap(
    req: Request<
      { paymentRequestId: string },
      {},
      {
        tagData: string;
        secureSfcProof?: SecureSfcProof;
        authorizationDuration: PaymentAuthorizationDuration;
      }
    >,
    res: Response,
  ): Promise<void> {
    const dto: HandleSfcTapDto = {
      ...req.body,
      paymentRequestId: req.params.paymentRequestId,
    };

    const authorization = await this.handleSfcPaymentTapUseCase.execute(dto);

    sendSuccess(
      res,
      toPaymentAuthorizationResponse(authorization),
      "Success.",
      StatusCodes.CREATED,
    );
  }

  async authorize(
    req: Request<{ paymentRequestId: string }, AuthorizeBasicPaymentDto>,
    res: Response,
  ): Promise<void> {
    const dto = req.body;

    const authorization = await this.basicPaymentAuthorizationService.authorize(
      {
        paymentRequestId: req.params.paymentRequestId,
        authorizationId: dto.authorizationId,
        userId: req.authUser.userId,
        pin: dto.pin,
      },
    );

    sendSuccess(res, toPaymentAuthorizationResponse(authorization));
  }
}
