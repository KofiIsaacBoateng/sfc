import type { UserRole } from "@/modules/users/domain/entities/user.entity.js";

export enum RecipientIdentifierType {
  PHONE = "PHONE",
  DEVICE = "DEVICE",
}

export interface RecipientResolutionDto {
  type: RecipientIdentifierType;
  value: string;
}

export interface RecipientResolutionResponseDto {
  userId: string;
  displayName: string;
  phoneNumber: string;
  walletId: string;
  accountType: UserRole;
}
