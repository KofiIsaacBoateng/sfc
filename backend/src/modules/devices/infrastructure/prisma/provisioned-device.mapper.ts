import type { ProvisionedDevice as PrismaProvisionedDevice } from "@/generated/client/client.js";
import {
  ProvisionedDevice,
  ProvisionedDeviceStatus,
  ProvisionedDeviceType,
  SecurityTier,
} from "../../domain/entities/provisioned-device.entity.js";

export class ProvisionedDeviceMapper {
  static toDomain(raw: PrismaProvisionedDevice): ProvisionedDevice {
    return ProvisionedDevice.restore({
      ...raw,
      status: raw.status as ProvisionedDeviceStatus,
      deviceType: raw.deviceType as ProvisionedDeviceType,
      securityTier: raw.securityTier as SecurityTier,
    });
  }

  static toPersistence(device: ProvisionedDevice): PrismaProvisionedDevice {
    return {
      id: device.id,
      editionId: device.editionId,
      serialNumber: device.serialNumber,
      activationCodeHash: device.activationCodeHash,
      deviceType: device.deviceType,
      status: device.status,
      securityTier: device.securityTier,
      claimedAt: device.claimedAt,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    };
  }
}
