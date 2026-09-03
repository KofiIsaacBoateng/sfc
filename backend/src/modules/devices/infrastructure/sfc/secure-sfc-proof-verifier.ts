import type {
  SecureSfcProof,
  SecureSfcProofVerifier,
} from "../../application/ports/secure-sfc-proof-verifier.port.js";
import type { DeviceRepository } from "../../domain/repositories/device.repository.js";

export class SecureSfcProofVerifierService implements SecureSfcProofVerifier {
  constructor(private readonly sfcDevices: DeviceRepository) {}

  async verify({
    deviceId,
    provisionedDeviceId,
    proof,
  }: {
    deviceId: string;
    provisionedDeviceId: string;
    proof: SecureSfcProof;
  }): Promise<boolean> {
    const cryptographicallyValid = await this.verifyCryptographicProof(
      provisionedDeviceId,
      proof,
    );

    if (!cryptographicallyValid) {
      return false;
    }

    return this.sfcDevices.acceptSecureCounter(deviceId, proof.counter);
  }

  private async verifyCryptographicProof(
    provisionedDeviceId: string,
    proof: SecureSfcProof,
  ): Promise<boolean> {
    // Real NTAG crypto verification goes here.
    // Keep this implementation separate from replay protection.
    return false;
  }
}
