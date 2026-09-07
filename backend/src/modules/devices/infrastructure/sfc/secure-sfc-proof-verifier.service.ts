import BadRequestError from "@/shared/errors/bad-request.js";
import type {
  SecureSfcCryptographicVerifier,
  SecureSfcProof,
  SecureSfcProofVerifier,
} from "../../application/ports/secure-sfc-proof-verifier.port.js";
import type { DeviceRepository } from "../../domain/repositories/device.repository.js";

export class SecureSfcProofVerifierService implements SecureSfcProofVerifier {
  constructor(
    private readonly sfcDevices: DeviceRepository,
    private readonly cryptographicVerifier: SecureSfcCryptographicVerifier,
  ) {}

  async verify({
    deviceId,
    provisionedDeviceId,
    secureSfcProof,
  }: {
    deviceId: string;
    provisionedDeviceId: string;
    secureSfcProof: SecureSfcProof;
  }): Promise<boolean> {
    if (secureSfcProof.counter < 0n) {
      throw new BadRequestError(undefined, "Invalid secure counter.");
    }

    if (!secureSfcProof.uid.trim()) {
      throw new BadRequestError(undefined, "Invalid SFC UID.");
    }

    if (!secureSfcProof.cryptogram.trim()) {
      throw new BadRequestError(undefined, "Invalid secure cryptogram.");
    }

    const cryptographicallyValid = await this.cryptographicVerifier.verify({
      provisionedDeviceId,
      secureSfcProof,
    });

    if (!cryptographicallyValid) {
      return false;
    }

    return this.sfcDevices.acceptSecureCounter(
      deviceId,
      secureSfcProof.counter,
    );
  }
}
