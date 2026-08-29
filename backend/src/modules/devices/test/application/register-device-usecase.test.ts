import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActivationCodeHasher } from "../applications/ports/activation-code-hasher.js";
import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { Repositories } from "@/shared/application/unit-of-work/repositories.js";
import { RegisterDeviceUseCase } from "../applications/use-cases/register-device.usecase.js";
import NotFoundError from "@/shared/errors/not-found.js";
import {
  ProvisionedDevice,
  ProvisionedDeviceStatus,
  ProvisionedDeviceType,
  SecurityTier,
  type ProvisionedDeviceProps,
} from "../domain/entities/provisioned-device.entity.js";
import ConflictError from "@/shared/errors/conflict.js";
import {
  DeviceStatus,
  SfcDevice,
  type SfcDeviceProps,
} from "../domain/entities/sfc-device.entity.js";
import type {
  RegisterDeviceDto,
  RegisterDeviceResponseDto,
} from "../applications/dtos/register-device.dto.js";

/*** TEST BEGINS */
describe("Rigister Device Usecase", () => {
  let activationCodeHasher: ActivationCodeHasher;
  let unitOfWork: UnitOfWork;
  let repos: Repositories;
  const rawProvisionedDevice: ProvisionedDeviceProps = {
    id: "p-device-123",
    editionId: "edition-id",
    serialNumber: "serial-number",
    deviceType: ProvisionedDeviceType.BRACELET,
    activationCodeHash: "activation-code-hash",
    securityTier: SecurityTier.SECURE,
    status: ProvisionedDeviceStatus.AVAILABLE,
    claimedAt: new Date("2026-08-03:10:00:00.000Z"),
    updatedAt: new Date("2026-08-03:10:00:00.000Z"),
    createdAt: new Date("2026-08-03:10:00:00.000Z"),
  };
  const rawDevice: SfcDeviceProps = {
    id: "device-id",
    tagUid: "tag-123",
    userId: "user-123",
    provisionedDeviceId: "p-device-123",
    status: DeviceStatus.ACTIVE,
    lastSeenAt: null,
    createdAt: new Date("2026-08-03:10:00:00.000Z"),
    updatedAt: new Date("2026-08-03:10:00:00.000Z"),
  };
  const requestDto: RegisterDeviceDto = {
    tagUid: "tag-123",
    activationCode: "activation-code",
  };
  const responseDto: RegisterDeviceResponseDto = {
    id: "device-id",
    tagUid: "tag-123",
    status: DeviceStatus.ACTIVE,
    createdAt: new Date("2026-08-03:10:00:00.000Z"),
    updatedAt: new Date("2026-08-03:10:00:00.000Z"),
  };

  beforeEach(() => {
    activationCodeHasher = {
      hash: vi.fn().mockResolvedValue("activation-code-hash"),
    };

    repos = {
      device: {
        create: vi.fn(),
        findByTagUid: vi.fn(),
      },

      provisionedDevice: {
        findByActivationCodeHash: vi.fn(),
        update: vi.fn(),
        claim: vi.fn(),
      },
    } as unknown as Repositories;

    unitOfWork = {
      execute: vi.fn().mockImplementation((work) => work(repos)),
    };
  });

  it("should throw NotFoundError if activation code isn't recognised", async () => {
    const provisionedDevice = null;

    vi.mocked(
      repos.provisionedDevice.findByActivationCodeHash,
    ).mockResolvedValue(provisionedDevice);

    const registerDeviceUsecase = new RegisterDeviceUseCase(
      unitOfWork,
      activationCodeHasher,
    );

    await expect(
      registerDeviceUsecase.execute("user-123", {
        tagUid: "tag-123",
        activationCode: "activation-code",
      }),
    ).rejects.throws(NotFoundError);

    expect(activationCodeHasher.hash).toHaveBeenCalledWith("activation-code");
    expect(
      repos.provisionedDevice.findByActivationCodeHash,
    ).toHaveBeenCalledWith("activation-code-hash");
  });

  it("should throw ConflictError if provisioned device has already been claimed", async () => {
    const provisionedDevice = ProvisionedDevice.restore({
      ...rawProvisionedDevice,
      status: ProvisionedDeviceStatus.CLAIMED,
    });

    vi.mocked(
      repos.provisionedDevice.findByActivationCodeHash,
    ).mockResolvedValue(provisionedDevice);

    const registerDeviceUsecase = new RegisterDeviceUseCase(
      unitOfWork,
      activationCodeHasher,
    );

    await expect(
      registerDeviceUsecase.execute("user-123", {
        tagUid: "tag-123",
        activationCode: "activation-code",
      }),
    ).rejects.throws(ConflictError);

    expect(activationCodeHasher.hash).toHaveBeenCalledWith("activation-code");
    expect(
      repos.provisionedDevice.findByActivationCodeHash,
    ).toHaveBeenCalledWith("activation-code-hash");
  });

  /** It should throw ConflictError if device is registered to another user */
  it("should throw ConflictError if device is registered to another user", async () => {
    const provisionedDevice = ProvisionedDevice.restore({
      ...rawProvisionedDevice,
    });
    const device = SfcDevice.restore({
      ...rawDevice,
    });

    vi.mocked(
      repos.provisionedDevice.findByActivationCodeHash,
    ).mockResolvedValue(provisionedDevice);
    vi.mocked(repos.device.findByTagUid).mockResolvedValue(device);

    const registerDeviceUsecase = new RegisterDeviceUseCase(
      unitOfWork,
      activationCodeHasher,
    );

    await expect(
      registerDeviceUsecase.execute("user-123", requestDto),
    ).rejects.throws(ConflictError);
    expect(activationCodeHasher.hash).toHaveBeenCalledWith("activation-code");
    expect(
      repos.provisionedDevice.findByActivationCodeHash,
    ).toHaveBeenCalledWith("activation-code-hash");
    expect(repos.device.findByTagUid).toHaveBeenCalledWith("tag-123");
  });

  /** It should register a provisioned device to a user without error and return a new device */
  it("should register a provisioned device to a user without error and return a new device", async () => {
    const provisionedDevice = ProvisionedDevice.restore({
      ...rawProvisionedDevice,
    });
    const device = SfcDevice.restore({
      ...rawDevice,
    });

    vi.mocked(
      repos.provisionedDevice.findByActivationCodeHash,
    ).mockResolvedValue(provisionedDevice);
    vi.mocked(repos.device.findByTagUid).mockResolvedValue(null);
    vi.mocked(repos.device.create).mockResolvedValue(device);

    const registerDeviceUseCase = new RegisterDeviceUseCase(
      unitOfWork,
      activationCodeHasher,
    );

    const result = await registerDeviceUseCase.execute("user-123", requestDto);

    expect(activationCodeHasher.hash).toHaveBeenCalledWith("activation-code");
    expect(
      repos.provisionedDevice.findByActivationCodeHash,
    ).toHaveBeenCalledWith("activation-code-hash");
    expect(repos.device.findByTagUid).toHaveBeenCalledWith("tag-123");
    expect(provisionedDevice.status).equals(ProvisionedDeviceStatus.CLAIMED);
    expect(result.tagUid).equals(responseDto.tagUid);
    expect(result.status).equals(responseDto.status);
  });
});
