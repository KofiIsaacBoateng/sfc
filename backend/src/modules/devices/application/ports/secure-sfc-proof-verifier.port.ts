import type { SfcDeviceVerificationResult } from "./sfc-device-verifier.port.js";

export interface SecureSfcProof {
  uid: string;
  counter: bigint;
  cryptogram: string;
}

export interface SecureSfcProofVerifier {
  verify(params: {
    deviceId: string;
    proof: SecureSfcProof;
  }): Promise<SfcDeviceVerificationResult>;
}
