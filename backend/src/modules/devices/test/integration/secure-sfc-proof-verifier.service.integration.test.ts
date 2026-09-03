import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { PrismaDeviceRepository } from "../../infrastructure/prisma/prisma-device.repository.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";

const TEST_PREFIX = "accept-secure-counter-test";

describe("PrismaDeviceRepository - acceptSecureCounter", () => {
  let repository: PrismaDeviceRepository;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.sfcDevice.deleteMany({
      where: {
        tagUid: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    await prisma.provisionedDevice.deleteMany({
      where: {
        serialNumber: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        firebaseUid: {
          startsWith: TEST_PREFIX,
        },
      },
    });

    repository = new PrismaDeviceRepository(prisma);
  });

  async function createUser() {
    const suffix = crypto.randomUUID();

    return prisma.user.create({
      data: {
        firebaseUid: `${TEST_PREFIX}-${suffix}`,
        phoneNumber: `233${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: "ACTIVE",
        role: "INDIVIDUAL",
      },
    });
  }

  async function createProvisionedDevice() {
    let edition = await prisma.deviceEdition.findFirst();

    if (!edition) {
      edition = await prisma.deviceEdition.create({
        data: {
          id: `${TEST_PREFIX}-ID`,
          code: `${TEST_PREFIX}-edition`,
          name: `${TEST_PREFIX}-NAME`,
          description: null,
          isLimited: false,
          maxDevices: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const suffix = crypto.randomUUID();

    return prisma.provisionedDevice.create({
      data: {
        editionId: edition.id,
        serialNumber: `${TEST_PREFIX}-serial-${suffix}`,
        activationCodeHash: `${TEST_PREFIX}-activation-${suffix}`,
        deviceType: "CARD",
        securityTier: "SECURE",
        status: "CLAIMED",
        claimedAt: new Date(),
      },
    });
  }

  async function createSfcDevice(lastAcceptedCounter: bigint | null = null) {
    const user = await createUser();
    const provisionedDevice = await createProvisionedDevice();

    return prisma.sfcDevice.create({
      data: {
        userId: user.id,
        provisionedDeviceId: provisionedDevice.id,
        tagUid: `${TEST_PREFIX}-uid-${crypto.randomUUID()}`,
        status: "ACTIVE",
        lastAcceptedCounter,
      },
    });
  }

  it("accepts the first secure counter when no counter has been accepted yet", async () => {
    const device = await createSfcDevice(null);

    const result = await repository.acceptSecureCounter(device.id, 1n);

    expect(result).toBe(true);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored).not.toBeNull();
    expect(stored?.lastAcceptedCounter).toBe(1n);
  });

  it("accepts a counter greater than the last accepted counter", async () => {
    const device = await createSfcDevice(10n);

    const result = await repository.acceptSecureCounter(device.id, 11n);

    expect(result).toBe(true);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(11n);
  });

  it("rejects the same counter", async () => {
    const device = await createSfcDevice(10n);

    const result = await repository.acceptSecureCounter(device.id, 10n);

    expect(result).toBe(false);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(10n);
  });

  it("rejects a lower counter", async () => {
    const device = await createSfcDevice(10n);

    const result = await repository.acceptSecureCounter(device.id, 9n);

    expect(result).toBe(false);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(10n);
  });

  it("does not change the stored counter when a lower counter is rejected", async () => {
    const device = await createSfcDevice(100n);

    const result = await repository.acceptSecureCounter(device.id, 50n);

    expect(result).toBe(false);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(100n);
  });

  it("does not change the stored counter when the same counter is rejected", async () => {
    const device = await createSfcDevice(100n);

    const result = await repository.acceptSecureCounter(device.id, 100n);

    expect(result).toBe(false);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(100n);
  });

  it("returns false when the device does not exist", async () => {
    const result = await repository.acceptSecureCounter(
      crypto.randomUUID(),
      1n,
    );

    expect(result).toBe(false);
  });

  it("rejects a negative counter", async () => {
    const device = await createSfcDevice(null);

    await expect(
      repository.acceptSecureCounter(device.id, -1n),
    ).rejects.toThrow("Invalid secure counter.");

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBeNull();
  });

  it("accepts a large bigint counter", async () => {
    const device = await createSfcDevice(9_999_999_999_999n);

    const result = await repository.acceptSecureCounter(
      device.id,
      10_000_000_000_000n,
    );

    expect(result).toBe(true);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(10_000_000_000_000n);
  });

  it("allows only one concurrent request to accept the same counter", async () => {
    const device = await createSfcDevice(10n);

    const [first, second] = await Promise.all([
      repository.acceptSecureCounter(device.id, 11n),
      repository.acceptSecureCounter(device.id, 11n),
    ]);

    expect([first, second].filter(Boolean)).toHaveLength(1);
    expect([first, second].filter((value) => !value)).toHaveLength(1);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(11n);
  });

  it("accepts sequentially increasing counters", async () => {
    const device = await createSfcDevice(10n);

    expect(await repository.acceptSecureCounter(device.id, 11n)).toBe(true);

    expect(await repository.acceptSecureCounter(device.id, 12n)).toBe(true);

    expect(await repository.acceptSecureCounter(device.id, 13n)).toBe(true);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(13n);
  });

  it("rejects a previously accepted counter after a newer counter has been accepted", async () => {
    const device = await createSfcDevice(10n);

    expect(await repository.acceptSecureCounter(device.id, 11n)).toBe(true);

    expect(await repository.acceptSecureCounter(device.id, 12n)).toBe(true);

    expect(await repository.acceptSecureCounter(device.id, 11n)).toBe(false);

    const stored = await prisma.sfcDevice.findUnique({
      where: {
        id: device.id,
      },
    });

    expect(stored?.lastAcceptedCounter).toBe(12n);
  });
});
