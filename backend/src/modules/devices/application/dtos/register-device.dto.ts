import type { DeviceStatus } from "../../domain/entities/sfc-device.entity.js";

export interface RegisterDeviceDto {
  activationCode: string;
  tagUid: string;
}

export interface RegisterDeviceResponseDto {
  id: string;
  tagUid: string;
  status: DeviceStatus;
  createdAt: Date;
  updatedAt: Date;
}
