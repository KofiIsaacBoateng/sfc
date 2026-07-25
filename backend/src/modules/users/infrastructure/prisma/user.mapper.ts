import type { User as PrismaUser, Prisma } from "@/generated/client/client.js";
import {
  User,
  UserRole,
  UserStatus,
} from "@/modules/users/domain/entities/user.entity.js";
import { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";

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

  static toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      phoneNumber: user.phoneNumber.value,
      status: user.status,
      role: user.role,
    };
  }
}
