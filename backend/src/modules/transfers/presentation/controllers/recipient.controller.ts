import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { RecipientResolutionDto } from "../../application/dto/recipient-resolution.dto.js";
import type { RecipientResolutionUsecase } from "../../application/use-cases/recipient-resolution.usecase.js";
import type { Request, Response } from "express";

export class RecipientController {
  constructor(
    private readonly recipientResolutionUsecase: RecipientResolutionUsecase,
  ) {}

  async resolve(req: Request<{}, {}, RecipientResolutionDto>, res: Response) {
    const recipient = await this.recipientResolutionUsecase.execute(req.body);

    sendSuccess(res, recipient, "Recipient resolution success!");
  }
}
