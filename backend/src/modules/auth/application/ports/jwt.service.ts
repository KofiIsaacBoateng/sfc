import type { User } from "@/src/modules/users/domain/entities/user.entity.js";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtService {
  issueToken(user: User): Promise<TokenPair> | TokenPair;
}
