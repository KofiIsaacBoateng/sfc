import { NotFoundError, UnauthorizedError } from "@/shared/errors/index.js";

import type { DeviceRepository } from "../../domain/repositories/device.repository.js";

import type { ProvisionedDeviceRepository } from "../../domain/repositories/provisioned-device.repository.js";

import type {
  SfcDeviceVerifier,
  SfcDeviceVerificationResult,
} from "../ports/sfc-device-verifier.port.js";
import type {
  SecureSfcProof,
  SecureSfcProofVerifier,
} from "../ports/secure-sfc-proof-verifier.port.js";
import { SecurityTier } from "../../domain/entities/provisioned-device.entity.js";

export interface VerifySfcDeviceInput {
  tagData: SecureSfcProof | string;
}

export class SfcDeviceVerifierService implements SfcDeviceVerifier {
  constructor(
    private readonly devices: DeviceRepository,
    private readonly provisionedDevices: ProvisionedDeviceRepository,
    private readonly secureSfcProofVerifier: SecureSfcProofVerifier,
  ) {}

  async verify(params: {
    tagData: string;
    proof?: SecureSfcProof;
  }): Promise<SfcDeviceVerificationResult> {
    const device = await this.devices.findByTagUid(params.tagData);

    if (!device) {
      throw new NotFoundError(undefined, "SFC device is not registered.");
    }

    const provisionedDevice = await this.provisionedDevices.findById(
      device.provisionedDeviceId,
    );

    if (!provisionedDevice) {
      throw new NotFoundError(
        undefined,
        "SFC device provisioning record not found.",
      );
    }

    if (!device.isActive()) {
      throw new UnauthorizedError(undefined, "SFC device is not active.");
    }

    if (!provisionedDevice.isClaimed()) {
      throw new UnauthorizedError(
        undefined,
        "SFC device has not been claimed.",
      );
    }

    if (provisionedDevice.securityTier === SecurityTier.SECURE) {
      if (!params.proof) {
        throw new UnauthorizedError(undefined, "Secure SFC proof is required.");
      }

      const verified = await this.secureSfcProofVerifier.verify({
        proof: params.proof,
        deviceId: device.id,
      });

      if (!verified) {
        throw new UnauthorizedError(
          undefined,
          "SFC secure device verification failed.",
        );
      }
    }

    return {
      verified: true,
      deviceId: device.id,
      userId: device.userId,
      securityTier: provisionedDevice.securityTier,
    };
  }
}
