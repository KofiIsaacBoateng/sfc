import type { DeviceStatus } from "@/generated/client/enums.js";

import type { SfcDevice } from "../../domain/entities/sfc-device.entity.js";

export interface SfcDeviceResponseDto {
  id: string;
  provisionedDeviceId: string;
  tagUid: string;
  status: DeviceStatus;
  lastSeenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const toSfcDeviceResponse = (
  device: SfcDevice,
): SfcDeviceResponseDto => ({
  id: device.id,
  provisionedDeviceId: device.provisionedDeviceId,
  tagUid: device.tagUid,
  status: device.status,
  lastSeenAt: device.lastSeenAt,
  createdAt: device.createdAt,
  updatedAt: device.updatedAt,
});
