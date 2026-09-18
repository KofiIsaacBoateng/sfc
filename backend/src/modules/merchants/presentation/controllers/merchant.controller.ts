import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { GetMyMerchantUseCase } from "../../application/use-cases/get-my-merchant.usecase.js";
import type { UpdateMyMerchantUseCase } from "../../application/use-cases/update-my-merchant.usecase.js";
import type { Request, Response } from "express";
import { toMerchantResponse } from "../../application/dto/merchant-response.dto.js";

export class MerchantController {
  constructor(
    private readonly getMyMerchantUseCase: GetMyMerchantUseCase,
    private readonly updateMyMerchantUseCase: UpdateMyMerchantUseCase,
  ) {}

  async getMyMerchant(req: Request, res: Response): Promise<void> {
    const merchant = await this.getMyMerchantUseCase.execute(
      req.authUser.userId,
    );

    sendSuccess(
      res,
      toMerchantResponse(merchant),
      "Fetched merchant successfully.",
    );
  }

  async updateMyMerchant(
    req: Request<{}, {}, { businessName: string }>,
    res: Response,
  ): Promise<void> {
    const merchant = await this.updateMyMerchantUseCase.execute(
      req.authUser.userId,
      { businessName: req.body.businessName },
    );

    sendSuccess(
      res,
      toMerchantResponse(merchant),
      "Patched Merchant Successfully.",
    );
  }
}
