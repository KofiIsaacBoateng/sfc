import type { PrismaClient } from "@prisma/client";

import type { PushDeviceRepository } from "../../domain/repositories/push-device.repository.js";

import type { PushDevice } from "../../domain/entities/push-device.entity.js";

import { PushDeviceMapper } from "./push-device.mapper.js";

export class PrismaPushDeviceRepository implements PushDeviceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(device: PushDevice): Promise<PushDevice> {
    const raw = await this.prisma.pushDevice.create({
      data: PushDeviceMapper.toPersistence(device),
    });

    return PushDeviceMapper.toDomain(raw);
  }

  async update(device: PushDevice): Promise<PushDevice> {
    const raw = await this.prisma.pushDevice.update({
      where: {
        id: device.id,
      },
      data: PushDeviceMapper.toPersistence(device),
    });

    return PushDeviceMapper.toDomain(raw);
  }

  async findByToken(token: string): Promise<PushDevice | null> {
    const raw = await this.prisma.pushDevice.findUnique({
      where: {
        token,
      },
    });

    return raw ? PushDeviceMapper.toDomain(raw) : null;
  }

  async findByUserId(userId: string): Promise<PushDevice[]> {
    const rows = await this.prisma.pushDevice.findMany({
      where: {
        userId,
      },
      orderBy: {
        lastSeenAt: "desc",
      },
    });

    return rows.map(PushDeviceMapper.toDomain);
  }

  async findById(id: string): Promise<PushDevice | null> {
    const raw = await this.prisma.findUnique({ where: { id } });

    return raw ? PushDeviceMapper.toDomain(raw) : null;
  }
}
