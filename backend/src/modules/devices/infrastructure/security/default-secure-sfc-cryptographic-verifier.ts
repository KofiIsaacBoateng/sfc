import type {
  SecureSfcCryptographicVerifier,
  SecureSfcProof,
} from "../../application/ports/secure-sfc-proof-verifier.port.js";

export class DefaultSecureSfcCryptographicVerifier implements SecureSfcCryptographicVerifier {
  async verify(_ /** params */ : {
    provisionedDeviceId: string;
    secureSfcProof: SecureSfcProof;
  }): Promise<boolean> {
    /*
     * Verify the cryptogram against the provisioned device's
     * cryptographic identity/key material.
     *
     * IMPORTANT:
     * The actual NTAG 424 DNA / SFC cryptographic verification
     * algorithm belongs here.
     */
    return false;
  }
}
