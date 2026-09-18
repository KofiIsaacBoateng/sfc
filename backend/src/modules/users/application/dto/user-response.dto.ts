import type {
  User,
  UserRole,
  UserStatus,
} from "../../domain/entities/user.entity.js";

export interface UserResponseDto {
  id: string;
  phoneNumber: string;
  displayName: string | null;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
}

export const toUserResponse = (user: User): UserResponseDto => ({
  id: user.id,
  phoneNumber: user.phoneNumber.value,
  displayName: user.displayName,
  status: user.status,
  role: user.role,
  createdAt: user.createdAt,
});
