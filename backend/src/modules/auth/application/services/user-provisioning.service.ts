import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import { User, UserRole } from "../../../users/domain/entities/user.entity.js";
import type { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";
import { WalletProvisioningService } from "../../../wallets/application/services/wallet-provisioning.service.js";

interface ProvisionUserInput {
  firebaseUid: string;
  phoneNumber: PhoneNumber;
  role: UserRole;
}

export class UserProvisioningService {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly walletProvisioningService: WalletProvisioningService,
  ) {}

  async provision(input: ProvisionUserInput): Promise<User> {
    return this.unitOfWork.execute(async (repos): Promise<User> => {
      const existing = await repos.users.findByFirebaseUid(input.firebaseUid);

      if (existing) {
        return existing;
      }

      // uiw postgresql transaction operation
      // user transaction
      const user = User.register({ ...input });
      const createdUser = await repos.users.create(user);

      // wallet provisioning - default wallet and ledger account for each user
      await this.walletProvisioningService.createDefaultWallet(
        { wallets: repos.wallets, ledger: repos.ledger },
        {
          userId: createdUser.id,
        },
      );

      return createdUser;
    });
  }
}
