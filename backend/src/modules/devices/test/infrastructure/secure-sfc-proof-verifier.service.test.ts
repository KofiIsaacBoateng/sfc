import { describe, expect, it, vi } from "vitest";

import { SecureSfcProofVerifierService } from "../../infrastructure/sfc/secure-sfc-proof-verifier.service.js";

describe("SecureSfcProofVerifierService", () => {
  const proof = {
    uid: "04AABBCCDDEE",
    counter: 10n,
    cryptogram: "VALID_CRYPTOGRAM",
  };

  const createSut = ({
    cryptoValid = true,
    counterAccepted = true,
  }: {
    cryptoValid?: boolean;
    counterAccepted?: boolean;
  } = {}) => {
    const sfcDevices = {
      acceptSecureCounter: vi.fn().mockResolvedValue(counterAccepted),
    };

    const cryptographicVerifier = {
      verify: vi.fn().mockResolvedValue(cryptoValid),
    };

    const sut = new SecureSfcProofVerifierService(
      sfcDevices as any,
      cryptographicVerifier as any,
    );

    return {
      sut,
      sfcDevices,
      cryptographicVerifier,
    };
  };

  it("accepts a valid non-replayed proof", async () => {
    const { sut, sfcDevices, cryptographicVerifier } = createSut();

    const result = await sut.verify({
      deviceId: "sfc-device-id",
      provisionedDeviceId: "provisioned-device-id",
      proof,
    });

    expect(result).toBe(true);

    expect(cryptographicVerifier.verify).toHaveBeenCalledWith({
      provisionedDeviceId: "provisioned-device-id",
      proof,
    });

    expect(sfcDevices.acceptSecureCounter).toHaveBeenCalledWith(
      "sfc-device-id",
      10n,
    );
  });

  it("rejects an invalid cryptographic proof", async () => {
    const { sut, sfcDevices } = createSut({
      cryptoValid: false,
    });

    const result = await sut.verify({
      deviceId: "sfc-device-id",
      provisionedDeviceId: "provisioned-device-id",
      proof,
    });

    expect(result).toBe(false);

    expect(sfcDevices.acceptSecureCounter).not.toHaveBeenCalled();
  });

  it("rejects a replayed proof", async () => {
    const { sut } = createSut({
      counterAccepted: false,
    });

    const result = await sut.verify({
      deviceId: "sfc-device-id",
      provisionedDeviceId: "provisioned-device-id",
      proof,
    });

    expect(result).toBe(false);
  });

  it("does not accept a negative counter", async () => {
    const { sut, cryptographicVerifier } = createSut();

    await expect(
      sut.verify({
        deviceId: "sfc-device-id",
        provisionedDeviceId: "provisioned-device-id",
        proof: {
          ...proof,
          counter: -1n,
        },
      }),
    ).rejects.toThrow("Invalid secure counter.");

    expect(cryptographicVerifier.verify).not.toHaveBeenCalled();
  });

  it("does not accept an empty UID", async () => {
    const { sut } = createSut();

    await expect(
      sut.verify({
        deviceId: "sfc-device-id",
        provisionedDeviceId: "provisioned-device-id",
        proof: {
          ...proof,
          uid: "   ",
        },
      }),
    ).rejects.toThrow("Invalid SFC UID.");
  });

  it("does not accept an empty cryptogram", async () => {
    const { sut } = createSut();

    await expect(
      sut.verify({
        deviceId: "sfc-device-id",
        provisionedDeviceId: "provisioned-device-id",
        proof: {
          ...proof,
          cryptogram: "   ",
        },
      }),
    ).rejects.toThrow("Invalid secure cryptogram.");
  });
});
