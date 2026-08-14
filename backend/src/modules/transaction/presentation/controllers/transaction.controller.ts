import type { Request, Response } from "express";

import { TransferMoneyUseCase } from "../../application/use-cases/transfer-money.usecase.js";
import { TransactionPresenter } from "../presenters/transaction.presenter.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";

export class TransactionController {
  constructor(private readonly transferMoneyUseCase: TransferMoneyUseCase) {}

  async transfer(req: Request, res: Response): Promise<void> {
    const transaction = await this.transferMoneyUseCase.execute(
      req.authUser.userId,
      req.body,
    );

    sendSuccess(
      res,
      TransactionPresenter.toTransferResponse(transaction),
      "Transaction confirmed.",
      201,
    );
  }
}
