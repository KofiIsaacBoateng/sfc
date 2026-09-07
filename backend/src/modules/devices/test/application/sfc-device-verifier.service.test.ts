import { describe, expect, it, vi } from "vitest";

import { SecurityTier } from "../../domain/entities/provisioned-device.entity.js";

import { SfcDeviceVerifierService } from "../../application/services/sfc-device-verifier.service.js";

describe("SfcDeviceVerifierService", () => {
  function createMocks() {
    const devices = {
      findByTagUid: vi.fn(),
    };

    const provisionedDevices = {
      findById: vi.fn(),
    };

    const secureProofVerifier = {
      verify: vi.fn(),
    };

    return {
      devices,
      provisionedDevices,
      secureProofVerifier,
    };
  }

  const device = {
    id: "device-1",
    userId: "user-1",
    provisionedDeviceId: "provisioned-1",
    isActive: () => true,
  };

  const provisionedDevice = {
    id: "provisioned-1",
    securityTier: SecurityTier.SECURE,
    isClaimed: () => true,
  };

  it("should verify an active claimed SFC device", async () => {
    const mocks = createMocks();

    mocks.devices.findByTagUid.mockResolvedValue(device);

    mocks.provisionedDevices.findById.mockResolvedValue(provisionedDevice);

    mocks.secureProofVerifier.verify.mockResolvedValue(true);

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    const result = await service.verify({
      tagData: "04AABBCCDD",
      secureSfcProof: {
        uid: "04AABBCCDD",
        counter: 42n,
        cryptogram: "ABC123",
      },
    });

    expect(result).toEqual({
      verified: true,
      deviceId: "device-1",
      userId: "user-1",
      securityTier: SecurityTier.SECURE,
    });
  });

  it("should derive security tier from ProvisionedDevice", async () => {
    const mocks = createMocks();

    mocks.devices.findByTagUid.mockResolvedValue(device);

    mocks.provisionedDevices.findById.mockResolvedValue({
      ...provisionedDevice,
      securityTier: SecurityTier.BASIC,
    });

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    const result = await service.verify({
      tagData: "04AABBCCDD",
    });

    expect(result.securityTier).toBe(SecurityTier.BASIC);
    expect(mocks.secureProofVerifier.verify).not.toHaveBeenCalled();
  });

  it("should reject an unknown SFC device", async () => {
    const mocks = createMocks();

    mocks.devices.findByTagUid.mockResolvedValue(null);

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    await expect(
      service.verify({
        tagData: "unknown-tag",
      }),
    ).rejects.toThrow("SFC device is not registered.");

    expect(mocks.provisionedDevices.findById).not.toHaveBeenCalled();
  });

  it("should reject a missing provisioning record", async () => {
    const mocks = createMocks();

    mocks.devices.findByTagUid.mockResolvedValue(device);

    mocks.provisionedDevices.findById.mockResolvedValue(null);

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    await expect(
      service.verify({
        tagData: "04AABBCCDD",
      }),
    ).rejects.toThrow("SFC device provisioning record not found.");
  });

  it("should reject an inactive device", async () => {
    const mocks = createMocks();

    mocks.devices.findByTagUid.mockResolvedValue({
      ...device,
      isActive: () => false,
    });

    mocks.provisionedDevices.findById.mockResolvedValue(provisionedDevice);

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    await expect(
      service.verify({
        tagData: "04AABBCCDD",
      }),
    ).rejects.toThrow("SFC device is not active.");
  });

  it("should reject an unclaimed device", async () => {
    const mocks = createMocks();

    mocks.devices.findByTagUid.mockResolvedValue(device);

    mocks.provisionedDevices.findById.mockResolvedValue({
      ...provisionedDevice,
      isClaimed: () => false,
    });

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    await expect(
      service.verify({
        tagData: "04AABBCCDD",
      }),
    ).rejects.toThrow("SFC device has not been claimed.");
  });

  it("should perform secure verification for a SECURE provisioned device", async () => {
    const mocks = createMocks();

    mocks.secureProofVerifier.verify.mockResolvedValue(true);

    mocks.devices.findByTagUid.mockResolvedValue(device);

    mocks.provisionedDevices.findById.mockResolvedValue(provisionedDevice);

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    const result = await service.verify({
      tagData: "dynamic-sfc-data",
      secureSfcProof: {
        uid: "04AABBCCDD",
        counter: 42n,
        cryptogram: "ABC123",
      },
    });

    expect(mocks.secureProofVerifier.verify).toHaveBeenCalledWith({
      deviceId: device.id,
      proof: {
        uid: "04AABBCCDD",
        counter: 42n,
        cryptogram: "ABC123",
      },
    });

    expect(result.securityTier).toBe(SecurityTier.SECURE);
  });

  it("should reject an invalid secure proof", async () => {
    const mocks = createMocks();

    mocks.secureProofVerifier.verify.mockResolvedValue(false);

    mocks.devices.findByTagUid.mockResolvedValue(device);

    mocks.provisionedDevices.findById.mockResolvedValue(provisionedDevice);

    const service = new SfcDeviceVerifierService(
      mocks.devices as never,
      mocks.provisionedDevices as never,
      mocks.secureProofVerifier,
    );

    await expect(
      service.verify({
        tagData: "dynamic-sfc-data",
        secureSfcProof: {
          uid: "04AABBCCDD",
          counter: 42n,
          cryptogram: "ABC123",
        },
      }),
    ).rejects.toThrow("SFC secure device verification failed.");
  });
});
