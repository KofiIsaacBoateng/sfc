import type { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";

export enum UserRole {
  INDIVIDUAL = "INDIVIDUAL",
  BUSINESS = "BUSINESS",
}

export enum UserStatus {
  PENDING_ONBOARDING = "PENDING_ONBOARDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

interface CreateUserProps {
  id: string;
  firebaseUid: string;
  phoneNumber: PhoneNumber;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface RegisterUserProps {
  firebaseUid: string;
  phoneNumber: PhoneNumber;
  displayName: string;
  role: UserRole;
}

export class User {
  private constructor(private readonly props: CreateUserProps) {}

  static register(props: RegisterUserProps): User {
    return new User({
      id: crypto.randomUUID(),
      firebaseUid: props.firebaseUid,
      phoneNumber: props.phoneNumber,
      displayName: props.displayName,
      role: props.role,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: CreateUserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get firebaseUid(): string {
    return this.props.firebaseUid;
  }

  get phoneNumber(): PhoneNumber {
    return this.props.phoneNumber;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  isIndividual(): boolean {
    return this.props.role === UserRole.INDIVIDUAL;
  }

  isBusiness(): boolean {
    return this.props.role === UserRole.BUSINESS;
  }

  canLogin(): boolean {
    return this.isActive();
  }

  suspend(): User {
    return new User({ ...this.props, status: UserStatus.SUSPENDED });
  }

  activate(): User {
    return new User({ ...this.props, status: UserStatus.ACTIVE });
  }
}
