import { randomUUID } from "crypto";

export enum MerchantStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

interface MerchantProps {
  id: string;
  userId: string;
  businessName: string;
  status: MerchantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Merchant {
  private constructor(private readonly props: MerchantProps) {}

  static create(params: { userId: string; businessName: string }): Merchant {
    const now = new Date();

    return new Merchant({
      id: randomUUID(),
      userId: params.userId,
      businessName: params.businessName,
      status: MerchantStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: MerchantProps): Merchant {
    return new Merchant(props);
  }

  isActive(): boolean {
    return this.props.status === MerchantStatus.ACTIVE;
  }

  suspend(): void {
    this.props.status = MerchantStatus.SUSPENDED;
    this.props.updatedAt = new Date();
  }

  close(): void {
    this.props.status = MerchantStatus.CLOSED;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.status = MerchantStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get businessName(): string {
    return this.props.businessName;
  }

  get status(): MerchantStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
