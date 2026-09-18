import BadRequestError from "@/shared/errors/bad-request.js";

import { PushDevice } from "../../domain/entities/push-device.entity.js";
import type { RegisterPushDeviceDto } from "../dtos/register-push-device.dto.js";
import type { PushDeviceRepository } from "../../domain/repositories/push-device.repository.js";

export class RegisterPushDeviceUseCase {
  constructor(private readonly pushDeviceRepository: PushDeviceRepository) {}

  async execute(
    userId: string,
    dto: RegisterPushDeviceDto,
  ): Promise<PushDevice> {
    if (!dto.token.trim()) {
      throw new BadRequestError(
        // "INVALID_PUSH_TOKEN", // TODO: missing error codes
        undefined,
        "Push notification token is required.",
      );
    }

    if (!dto.platform.trim()) {
      throw new BadRequestError(
        // "INVALID_PLATFORM",
        undefined,
        "Device platform is required.",
      );
    }

    const existing = await this.pushDeviceRepository.findByToken(dto.token);

    if (existing) {
      existing.touch();

      return this.pushDeviceRepository.update(existing);
    }

    const device = PushDevice.create({
      userId,
      token: dto.token,
      platform: dto.platform,
    });

    return this.pushDeviceRepository.create(device);
  }
}
