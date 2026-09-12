import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

import BadRequestError from "@/shared/errors/bad-request.js";

import { PushDevice } from "../../domain/entities/push-device.entity.js";

export class RegisterPushDeviceUseCase {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async execute(params: {
    userId: string;
    token: string;
    platform: string;
  }): Promise<PushDevice> {
    if (!params.token.trim()) {
      throw new BadRequestError(
        // "INVALID_PUSH_TOKEN", // TODO: missing error codes
        undefined,
        "Push notification token is required.",
      );
    }

    if (!params.platform.trim()) {
      throw new BadRequestError(
        // "INVALID_PLATFORM",
        undefined,
        "Device platform is required.",
      );
    }

    return this.unitOfWork.execute(async (repos) => {
      const existing = await repos.pushDevice.findByToken(params.token);

      if (existing) {
        existing.touch();

        return repos.pushDevice.update(existing);
      }

      const device = PushDevice.create({
        userId: params.userId,
        token: params.token,
        platform: params.platform,
      });

      return repos.pushDevice.create(device);
    });
  }
}
