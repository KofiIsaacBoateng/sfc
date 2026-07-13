import type { User as PrismaUser } from "@/src/generated/client/client.js";
import { User } from "@/src/modules/users/domain/entities/user.entity.js";
import { PhoneNumber } from "@/src/shared/domain/value-objects/phone-number.vo.js";
import type {
  UserRole,
  UserStatus,
} from "@/src/modules/users/domain/enums/index.js";

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.restore({
      id: raw.id,
      firebaseUid: raw.firebaseUid,
      phoneNumber: PhoneNumber.restore(raw.phoneNumber),
      status: raw.status as UserStatus,
      role: raw.role as UserRole,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      phoneNumber: user.phoneNumber.value,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
