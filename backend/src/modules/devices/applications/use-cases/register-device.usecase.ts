import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { ActivationCodeHasher } from "../ports/activation-code-hasher.js";
import type {
  RegisterDeviceDto,
  RegisterDeviceResponseDto,
} from "../dtos/register-device.dto.js";
import type { Repositories } from "@/shared/application/unit-of-work/repositories.js";
import NotFoundError from "@/shared/errors/not-found.js";
import ConflictError from "@/shared/errors/conflict.js";
import { SfcDevice } from "../../domain/entities/sfc-device.entity.js";

export class RegisterDeviceUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly activationCodeHasher: ActivationCodeHasher,
  ) {}

  async execute(userId: string, dto: RegisterDeviceDto) {
    const activationCodeHash = await this.activationCodeHasher.hash(
      dto.activationCode,
    );

    return this.unitOfWork.execute(
      async (repos: Repositories): Promise<RegisterDeviceResponseDto> => {
        // find provisioned device
        const provisionedDevice =
          await repos.provisionedDevice.findByActivationCodeHash(
            activationCodeHash,
          );

        if (!provisionedDevice) {
          throw new NotFoundError(
            undefined,
            "Invalid activation code (Device is not ours)",
          );
        }

        if (!provisionedDevice.isAvailable()) {
          throw new ConflictError(
            undefined,
            "Device has already been claimed!",
          );
        }

        const existingDevice = await repos.device.findByTagUid(dto.tagUid);

        if (existingDevice) {
          throw new ConflictError(undefined, "Tag is already registered.");
        }

        const device = SfcDevice.create({
          userId,
          provisionedDeviceId: provisionedDevice.id,
          tagUid: dto.tagUid,
        });

        provisionedDevice.claim();

        await repos.device.create(device);
        await repos.provisionedDevice.update(provisionedDevice);

        return {
          id: device.id,
          tagUid: device.tagUid,
          status: device.status,
          createdAt: device.createdAt,
          updatedAt: device.updatedAt,
        };
      },
    );
  }
}
