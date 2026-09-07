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
  tagData: string;
  secureSfcProof?: SecureSfcProof;
}

export class SfcDeviceVerifierService implements SfcDeviceVerifier {
  constructor(
    private readonly devices: DeviceRepository,
    private readonly provisionedDevices: ProvisionedDeviceRepository,
    private readonly secureSfcProofVerifier: SecureSfcProofVerifier,
  ) {}

  async verify(
    params: VerifySfcDeviceInput,
  ): Promise<SfcDeviceVerificationResult> {
    /** locate device from registered device archive */
    const device = await this.devices.findByTagUid(params.tagData);

    if (!device) {
      throw new NotFoundError(undefined, "SFC device is not registered.");
    }

    /** locate registered device from our inventory to tell the security tier */
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

    /** If S-Tier, verify proof */
    if (provisionedDevice.securityTier === SecurityTier.SECURE) {
      if (!params.secureSfcProof) {
        throw new UnauthorizedError(undefined, "Secure SFC proof is required.");
      }

      const verified = await this.secureSfcProofVerifier.verify({
        secureSfcProof: params.secureSfcProof,
        deviceId: device.id,
        provisionedDeviceId: provisionedDevice.id,
      });

      if (!verified) {
        throw new UnauthorizedError(undefined, "Invalid secure SFC proof.");
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
