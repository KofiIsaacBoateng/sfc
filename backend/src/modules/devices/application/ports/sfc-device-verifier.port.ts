import { SecurityTier } from "@/modules/devices/domain/entities/provisioned-device.entity.js";
import type { SecureSfcProof } from "./secure-sfc-proof-verifier.port.js";

export interface SfcDeviceVerificationResult {
  verified: boolean;
  deviceId: string;
  userId: string;
  securityTier: SecurityTier;
}

export interface SfcDeviceVerifier {
  verify(params: {
    tagData: string;
    proof?: SecureSfcProof;
  }): Promise<SfcDeviceVerificationResult>;
}
