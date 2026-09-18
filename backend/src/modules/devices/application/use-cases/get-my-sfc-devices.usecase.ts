import type { DeviceRepository } from "../../domain/repositories/device.repository.js";

export class GetMySfcDevicesUseCase {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute(userId: string) {
    return this.deviceRepository.findByUserId(userId);
  }
}
