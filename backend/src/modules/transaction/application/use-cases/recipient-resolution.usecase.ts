import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import {
  RecipientIdentifierType,
  type RecipientResolutionDto,
  type RecipientResolutionResponseDto,
} from "../dto/recipient-resolution.dto.js";
import type { User } from "@/modules/users/domain/entities/user.entity.js";
import { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";
import NotFoundError from "@/shared/errors/not-found.js";
import type { Repositories } from "@/shared/application/unit-of-work/repositories.js";

export class RecipientResolutionUsecase {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async execute(dto: RecipientResolutionDto) {
    return this.unitOfWork.execute(
      async (repos: Repositories): Promise<RecipientResolutionResponseDto> => {
        let user: User | null;

        switch (dto.type) {
          case RecipientIdentifierType.PHONE:
            user = await repos.users.findByPhoneNumber(
              PhoneNumber.create(dto.value),
            );
            break;

          case RecipientIdentifierType.DEVICE:
            const device = await repos.device.findByTagUid(dto.value);

            if (!device) {
              throw new NotFoundError("DEVICE_NOT_FOUND", "Device not found!");
            }

            user = await repos.users.findById(device.userId);
            break;
        }

        if (!user) {
          throw new NotFoundError("USER_NOT_FOUND", "Recipient not found!");
        }

        const wallet = await repos.wallets.findByUserId(user.id);

        if (!wallet) {
          throw new NotFoundError(
            "WALLET_NOT_FOUND",
            "Recipient wallet not found!",
          );
        }

        return {
          userId: user.id,
          phoneNumber: user.phoneNumber.value,
          displayName: user.displayName,
          walletId: wallet.id,
          accountType: user.role,
        };
      },
    );
  }
}
