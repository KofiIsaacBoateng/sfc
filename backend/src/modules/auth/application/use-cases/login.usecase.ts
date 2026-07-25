import type {
  User,
  UserRole,
} from "@/modules/users/domain/entities/user.entity.js";
import type { FirebaseAuthProvider } from "../ports/firebase-auth.provider.js";
import type { UserProvisioningService } from "../services/user-provisioning.service.js";
import type { JwtService, TokenPair } from "../ports/jwt.service.js";
import { PhoneNumber } from "../../../../shared/domain/value-objects/phone-number.vo.js";

export interface LoginInput {
  firebaseToken: string;
  role: UserRole;
}

export interface LoginResult extends TokenPair {
  user: User;
}

export class LoginUseCase {
  constructor(
    private readonly firebaseAuthProvider: FirebaseAuthProvider,
    private readonly userProvisioningService: UserProvisioningService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    // verify firebase token
    const identity = await this.firebaseAuthProvider.verifyIdToken(
      input.firebaseToken,
    );

    const phoneNumber = PhoneNumber.create(identity.phoneNumber);

    // provision our user
    const user = await this.userProvisioningService.provision({
      firebaseUid: identity.firebaseIdUid,
      phoneNumber,
      role: input.role,
    });

    // generate tokens
    const tokens = await this.jwtService.issueToken(user);

    return {
      ...tokens,
      user,
    };
  }
}
