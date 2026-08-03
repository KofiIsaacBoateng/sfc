import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";
import type { ProvisionedDeviceRepository } from "../../domain/repositories/provisioned-device.repository.js";
import type { ProvisionedDevice } from "../../domain/entities/provisioned-device.entity.js";
import { ProvisionedDeviceMapper } from "./provisioned-device.mapper.js";

export class PrismaProvisionedDeviceRepository implements ProvisionedDeviceRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async create(device: ProvisionedDevice): Promise<ProvisionedDevice> {
    const raw = await this.prisma.provisionedDevice.create({
      data: ProvisionedDeviceMapper.toPersistence(device),
    });

    return ProvisionedDeviceMapper.toDomain(raw);
  }

  async update(device: ProvisionedDevice): Promise<ProvisionedDevice> {
    const raw = await this.prisma.provisionedDevice.update({
      where: { id: device.id },
      data: ProvisionedDeviceMapper.toPersistence(device),
    });

    return ProvisionedDeviceMapper.toDomain(raw);
  }

  async findByActivationCodeHash(
    hash: string,
  ): Promise<ProvisionedDevice | null> {
    const raw = await this.prisma.provisionedDevice.findUnique({
      where: { activationCodeHash: hash },
    });

    return raw ? ProvisionedDeviceMapper.toDomain(raw) : null;
  }

  async findBySerialNumber(
    serialNumber: string,
  ): Promise<ProvisionedDevice | null> {
    const raw = await this.prisma.provisionedDevice.findUnique({
      where: { serialNumber },
    });

    return raw ? ProvisionedDeviceMapper.toDomain(raw) : null;
  }
}
