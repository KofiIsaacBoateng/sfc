import type {
  SecureSfcProof,
  SecureSfcProofVerifier,
} from "../../application/ports/secure-sfc-proof-verifier.port.js";
import type { SfcDeviceVerificationResult } from "../../application/ports/sfc-device-verifier.port.js";

export class SecureSfcProofVerifierService implements SecureSfcProofVerifier {
  async verify(params: {
    deviceId: string;
    proof: SecureSfcProof;
  }): Promise<SfcDeviceVerificationResult> {
    /*
     * Actual NTAG 424 DNA / X DNA verification
     * will be implemented here once the exact
     * mobile/NFC protocol is finalized.
     */
    throw new Error("Not implemented!");
  }
}
