import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";
import type { DeviceRepository } from "../../domain/repositories/device.repository.js";
import type { SfcDevice } from "../../domain/entities/sfc-device.entity.js";
import { DeviceMapper } from "./device.mapper.js";
import BadRequestError from "@/shared/errors/bad-request.js";

export class PrismaDeviceRepository implements DeviceRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async create(device: SfcDevice): Promise<SfcDevice> {
    const raw = await this.prisma.sfcDevice.create({
      data: DeviceMapper.toPersistence(device),
    });

    return DeviceMapper.toDomain(raw);
  }

  async update(device: SfcDevice): Promise<SfcDevice> {
    const raw = await this.prisma.sfcDevice.update({
      where: { id: device.id },
      data: DeviceMapper.toPersistence(device),
    });

    return DeviceMapper.toDomain(raw);
  }

  async findByProvisionedDeviceId(
    provisionedDeviceId: string,
  ): Promise<SfcDevice | null> {
    const raw = await this.prisma.sfcDevice.findUnique({
      where: { provisionedDeviceId },
    });

    return raw ? DeviceMapper.toDomain(raw) : null;
  }

  async findById(deviceId: string): Promise<SfcDevice | null> {
    const raw = await this.prisma.sfcDevice.findUnique({
      where: { id: deviceId },
    });

    return raw ? DeviceMapper.toDomain(raw) : null;
  }

  async findByTagUid(tagUid: string): Promise<SfcDevice | null> {
    const raw = await this.prisma.sfcDevice.findUnique({
      where: { tagUid },
    });

    return raw ? DeviceMapper.toDomain(raw) : null;
  }

  async findByUserId(userId: string): Promise<SfcDevice[]> {
    const raw = await this.prisma.sfcDevice.findMany({ where: { userId } });

    return raw.map((value) => DeviceMapper.toDomain(value));
  }

  async acceptSecureCounter(
    deviceId: string,
    counter: bigint,
  ): Promise<boolean> {
    if (counter < 0n) {
      throw new BadRequestError(undefined, "Invalid secure counter.");
    }
    const result = await this.prisma.sfcDevice.updateMany({
      where: {
        id: deviceId,
        OR: [
          { lastAcceptedCounter: null },
          {
            lastAcceptedCounter: {
              lt: counter,
            },
          },
        ],
      },
      data: {
        lastAcceptedCounter: counter,
        updatedAt: new Date(),
      },
    });

    return result.count === 1;
  }
}
