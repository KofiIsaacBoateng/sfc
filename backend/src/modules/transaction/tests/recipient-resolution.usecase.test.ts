import type { Repositories } from "@/shared/application/unit-of-work/repositories.js";
import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RecipientIdentifierType,
  type RecipientResolutionDto,
} from "../application/dto/recipient-resolution.dto.js";
import { User, UserRole } from "@/modules/users/domain/entities/user.entity.js";
import { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";
import { Wallet } from "@/modules/wallets/domain/entities/wallet.entity.js";
import { RecipientResolutionUsecase } from "../application/use-cases/recipient-resolution.usecase.js";
import { SfcDevice } from "@/modules/devices/domain/entities/sfc-device.entity.js";
import NotFoundError from "@/shared/errors/not-found.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

/*** TEST BEGIN */
describe("Recipient Resolution Usecase", () => {
  let unitOfWork: UnitOfWork;
  let repos: Repositories;
  let dto: RecipientResolutionDto;

  beforeEach(() => {
    repos = {
      users: {
        findById: vi.fn(),
        findByPhoneNumber: vi.fn(),
      },

      wallets: {
        findByUserId: vi.fn(),
      },

      device: {
        findByTagUid: vi.fn(),
      },
    } as unknown as Repositories;

    unitOfWork = {
      execute: vi.fn().mockImplementation((work) => work(repos)),
    };
  });

  /**** it should resolve recipient by phone */
  it("should resolve recipient by phone", async () => {
    dto = {
      value: "0541236789",
      type: RecipientIdentifierType.PHONE,
    };

    const user = User.register({
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.create(dto.value),
      displayName: "John Doe",
      role: UserRole.INDIVIDUAL,
    });

    const wallet = Wallet.create(user.id, Currency.GHS);

    vi.mocked(repos.users.findByPhoneNumber).mockResolvedValue(user);
    vi.mocked(repos.wallets.findByUserId).mockResolvedValue(wallet);

    const usecase = new RecipientResolutionUsecase(unitOfWork);

    const result = await usecase.execute(dto);

    expect(repos.users.findByPhoneNumber).toHaveBeenCalledWith(
      user.phoneNumber,
    );
    expect(repos.wallets.findByUserId).toHaveBeenCalledWith(user.id);
    expect(result).toMatchObject({
      userId: user.id,
      phoneNumber: user.phoneNumber.value,
      displayName: user.displayName,
      walletId: wallet.id,
      accountType: user.role,
    });
  });

  /**** it should resolve recipient by device */
  it("should resolve recipient by device", async () => {
    dto = {
      value: "tag-123",
      type: RecipientIdentifierType.DEVICE,
    };

    const user = User.register({
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.create("+233541236789"),
      displayName: "John Doe",
      role: UserRole.INDIVIDUAL,
    });

    const device = SfcDevice.create({
      userId: user.id,
      provisionedDeviceId: "p-device-123",
      tagUid: "tag-123",
    });

    const wallet = Wallet.create(user.id, Currency.GHS);

    vi.mocked(repos.device.findByTagUid).mockResolvedValue(device);
    vi.mocked(repos.users.findById).mockResolvedValue(user);
    vi.mocked(repos.wallets.findByUserId).mockResolvedValue(wallet);

    const usecase = new RecipientResolutionUsecase(unitOfWork);
    const result = await usecase.execute(dto);

    expect(repos.device.findByTagUid).toHaveBeenCalledWith("tag-123");
    expect(repos.users.findById).toHaveBeenCalledWith(user.id);
    expect(repos.wallets.findByUserId).toHaveBeenCalledWith(user.id);

    expect(result).toMatchObject({
      userId: user.id,
      phoneNumber: user.phoneNumber.value,
      displayName: user.displayName,
      walletId: wallet.id,
      accountType: user.role,
    });
  });

  /**** it should throw NotFoundError if Recipient device is not found */
  it("should throw a NotFoundError if recipient device is not found", async () => {
    dto = {
      value: "tag-123",
      type: RecipientIdentifierType.DEVICE,
    };

    vi.mocked(repos.device.findByTagUid).mockResolvedValue(null);

    const usecase = new RecipientResolutionUsecase(unitOfWork);
    await expect(usecase.execute(dto)).rejects.throws(NotFoundError);
  });

  /**** it should throw NotFoundError if Recipient doesn't exist */
  it("should throw a NofFoundError if recipient doesn't exist", async () => {
    dto = {
      value: "0541236789",
      type: RecipientIdentifierType.PHONE,
    };

    vi.mocked(repos.users.findByPhoneNumber).mockResolvedValue(null);

    const usecase = new RecipientResolutionUsecase(unitOfWork);
    await expect(usecase.execute(dto)).rejects.throws(NotFoundError);
  });

  /**** it should throw NotFoundError if Recipient has no wallet */
  it("should throw a NotFoundError if recipient has no wallet", async () => {
    dto = {
      value: "0541236789",
      type: RecipientIdentifierType.PHONE,
    };

    const user = User.register({
      firebaseUid: "firebase-id-123",
      phoneNumber: PhoneNumber.create(dto.value),
      displayName: "John Doe",
      role: UserRole.INDIVIDUAL,
    });

    vi.mocked(repos.users.findById).mockResolvedValue(user);
    vi.mocked(repos.wallets.findByUserId).mockResolvedValue(null);

    const usecase = new RecipientResolutionUsecase(unitOfWork);
    await expect(usecase.execute(dto)).rejects.throws(NotFoundError);
    expect(repos.users.findByPhoneNumber).toHaveBeenCalledTimes(1);
  });
});
