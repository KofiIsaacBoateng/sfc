import type { SfcDeviceVerificationResult } from "../../../devices/domain/authentication/sfc-device-verification-result.ts.js";

export interface SfcDeviceVerifier {
  verify(params: { tagData: string }): Promise<SfcDeviceVerificationResult>;
}
