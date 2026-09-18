import type { Request, Response } from "express";

import type { RegisterPushDeviceUseCase } from "../../application/use-cases/register-push-device.usecase.js";

export class NotificationDeviceController {
  constructor(
    private readonly registerPushDeviceUseCase: RegisterPushDeviceUseCase,
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const device = await this.registerPushDeviceUseCase.execute(
      req.authUser.userId,
      req.body,
    );

    res.status(201).json({
      id: device.id,
      token: device.token,
      platform: device.platform,
      lastSeenAt: device.lastSeenAt,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    });
  }
}
