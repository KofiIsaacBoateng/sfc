import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { GetMyWalletUseCase } from "../../application/use-case/get-my-wallet.usecase.js";
import type { Request, Response } from "express";
import { toWalletResponse } from "../../application/dto/wallet-response.dto.js";

export class WalletController {
  constructor(private readonly getMyWalletUseCase: GetMyWalletUseCase) {}

  getMyWallet = async (req: Request, res: Response): Promise<void> => {
    const wallet = await this.getMyWalletUseCase.execute(req.authUser.userId);

    sendSuccess(res, toWalletResponse(wallet), "Wallet retrieved successfully");
  };
}
