import { sendSuccess } from "@/shared/presentation/utils/response-formatter.js";
import type { RegisterDeviceUseCase } from "../../application/use-cases/register-device.usecase.js";
import type { Request, Response } from "express";
import type { RegisterDeviceDto } from "../../application/dtos/register-device.dto.js";
import type { GetMySfcDevicesUseCase } from "../../application/use-cases/get-my-sfc-devices.usecase.js";
import type { BlockMySfcDeviceUseCase } from "../../application/use-cases/block-my-sfc-device.usecase.js";
import type { UnblockMySfcDeviceUseCase } from "../../application/use-cases/unblock-my-sfc-device.usecase.js";
import { toSfcDeviceResponse } from "../../application/dtos/sfc-device-response.dto.js";

export class DeviceController {
  constructor(
    private readonly registerDeviceUseCase: RegisterDeviceUseCase,
    private readonly getMySfcDevicesUseCase: GetMySfcDevicesUseCase,
    private readonly blockMySfcDeviceUseCase: BlockMySfcDeviceUseCase,
    private readonly unblockMySfcDeviceUseCase: UnblockMySfcDeviceUseCase,
  ) {}

  async register(req: Request<{}, {}, RegisterDeviceDto>, res: Response) {
    const userId = req.authUser.userId;

    const device = await this.registerDeviceUseCase.execute(userId, req.body);

    sendSuccess(res, device, "Device created successfully", 201);
  }

  async getMyDevices(req: Request, res: Response): Promise<void> {
    const devices = await this.getMySfcDevicesUseCase.execute(
      req.authUser.userId,
    );

    sendSuccess(res, devices.map(toSfcDeviceResponse));
  }

  async block(
    req: Request<{ deviceId: string }>,
    res: Response,
  ): Promise<void> {
    const device = await this.blockMySfcDeviceUseCase.execute(
      req.authUser.userId,
      req.params.deviceId,
    );

    sendSuccess(res, toSfcDeviceResponse(device));
  }

  async unblock(
    req: Request<{ deviceId: string }>,
    res: Response,
  ): Promise<void> {
    const device = await this.unblockMySfcDeviceUseCase.execute(
      req.authUser.userId,
      req.params.deviceId,
    );

    sendSuccess(res, toSfcDeviceResponse(device));
  }
}
