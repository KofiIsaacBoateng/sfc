import type { User } from "@/src/modules/users/domain/entities/user.entity.js";
import type {
  JwtService,
  TokenPair,
} from "../../application/ports/jwt.service.js";
import jwt from "jsonwebtoken";

export class JwtTokenService implements JwtService {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string,
    private readonly accessExpiresIn = 15,
    private readonly refreshExpiresIn = 30,
  ) {}

  issueToken(user: User): Promise<TokenPair> | TokenPair {
    const payload = {
      sub: user.id,
      firebaseUid: user.firebaseUid,
      phoneNumber: user.phoneNumber.value,
      role: user.role,
      status: user.status,
    };

    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: `${this.accessExpiresIn}m`,
    });

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: `${this.refreshExpiresIn}d`,
    });

    return { accessToken, refreshToken };
  }
}
