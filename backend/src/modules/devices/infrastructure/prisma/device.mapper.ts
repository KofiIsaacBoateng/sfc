import type { SfcDevice as PrismaSfcDevice } from "@/generated/client/client.js";
import {
  DeviceStatus,
  SfcDevice,
} from "../../domain/entities/sfc-device.entity.js";

export class DeviceMapper {
  static toDomain(raw: PrismaSfcDevice): SfcDevice {
    return SfcDevice.restore({
      ...raw,
      status: raw.status as DeviceStatus,
    });
  }

  static toPersistence(device: SfcDevice): PrismaSfcDevice {
    return {
      id: device.id,
      userId: device.id,
      tagUid: device.tagUid,
      provisionedDeviceId: device.provisionedDeviceId,
      status: device.status,
      lastAcceptedCounter: device.lastAcceptedCounter,
      lastSeenAt: device.lastSeenAt,
      updatedAt: device.updatedAt,
      createdAt: device.createdAt,
    };
  }
}
