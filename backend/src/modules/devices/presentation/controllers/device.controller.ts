import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { RegisterDeviceUseCase } from "../../application/use-cases/register-device.usecase.js";
import type { Request, Response } from "express";
import type { RegisterDeviceDto } from "../../application/dtos/register-device.dto.js";

export class DeviceController {
  constructor(private readonly registerDeviceUseCase: RegisterDeviceUseCase) {}

  async register(req: Request<{}, {}, RegisterDeviceDto>, res: Response) {
    const userId = req.authUser.userId;

    const device = await this.registerDeviceUseCase.execute(userId, req.body);

    sendSuccess(res, device, "Device created successfully", 201);
  }
}
