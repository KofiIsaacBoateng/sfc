import NotFoundError from "@/shared/errors/not-found.js";
import ForbiddenError from "@/shared/errors/forbidden.js";
import ConflictError from "@/shared/errors/conflict.js";

import type { DeviceRepository } from "../../domain/repositories/device.repository.js";

export class UnblockMySfcDeviceUseCase {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute(userId: string, deviceId: string) {
    const device = await this.deviceRepository.findById(deviceId);

    if (!device) {
      throw new NotFoundError("DEVICE_NOT_FOUND", "SFC device not found.");
    }

    if (device.userId !== userId) {
      throw new ForbiddenError(
        undefined,
        "You are not allowed to modify this SFC device.",
      );
    }

    if (!device.isBlocked()) {
      throw new ConflictError(undefined, "SFC device is not blocked.");
    }

    device.unblock();

    return this.deviceRepository.update(device);
  }
}
