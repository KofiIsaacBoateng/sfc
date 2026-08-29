import { SecurityTier } from "@/modules/devices/domain/entities/provisioned-device.entity.js";

export interface SfcDeviceVerificationResult {
  verified: boolean;
  deviceId: string;
  userId: string;
  securityTier: SecurityTier;
}

export interface SfcDeviceVerifier {
  verify(params: { tagData: string }): Promise<SfcDeviceVerificationResult>;
}
