import type { Request, Response } from "express";

import { TransferMoneyUseCase } from "../../application/use-cases/transfer-money.usecase.js";
import { TransactionPresenter } from "../presenters/transaction.presenter.js";
import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { GetTransactionHistoryUseCase } from "../../application/use-cases/get-transaction-history.usecase.js";
import { toTransactionResponse } from "../../application/dto/transaction-response.dto.js";

export class TransactionController {
  constructor(
    private readonly transferMoneyUseCase: TransferMoneyUseCase,
    private readonly getTransactionHistoryUseCase: GetTransactionHistoryUseCase,
  ) {}

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

  async getMyTransactions(req: Request, res: Response): Promise<void> {
    const transactions = await this.getTransactionHistoryUseCase.execute(
      req.authUser.userId,
    );

    sendSuccess(
      res,
      transactions.map(toTransactionResponse),
      "Fetched transaction history successfully!",
    );
  }
}
