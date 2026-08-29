import { randomUUID } from "crypto";

export enum PaymentAuthorizationMethod {
  PIN = "PIN",
  SECURE_SFC = "SECURE_SFC",
}

export enum PaymentAuthorizationChannel {
  APP = "APP",
  USSD = "USSD",
}

export enum PaymentAuthorizationStatus {
  PENDING = "PENDING",
  AUTHORIZED = "AUTHORIZED",
  CONSUMED = "CONSUMED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export enum PaymentAuthorizationDuration {
  THIRTY_SECONDS = 30,
  ONE_MINUTE = 60,
  TWO_MINUTES = 120,
}

export interface PaymentAuthorizationProps {
  id: string;
  paymentRequestId: string;
  userId: string;
  method: PaymentAuthorizationMethod;
  channel: PaymentAuthorizationChannel;
  status: PaymentAuthorizationStatus;
  expiresAt: Date;
  authorizedAt: Date | null;
  consumedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentAuthorization {
  private constructor(private readonly props: PaymentAuthorizationProps) {}

  static create(params: {
    paymentRequestId: string;
    userId: string;
    method: PaymentAuthorizationMethod;
    channel: PaymentAuthorizationChannel;
    duration: PaymentAuthorizationDuration;
  }): PaymentAuthorization {
    const now = new Date();

    const expiresAt = new Date(now.getTime() + params.duration * 1000);

    return new PaymentAuthorization({
      id: randomUUID(),
      ...params,
      status: PaymentAuthorizationStatus.PENDING,
      consumedAt: null,
      authorizedAt: null,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: PaymentAuthorizationProps): PaymentAuthorization {
    return new PaymentAuthorization(props);
  }

  isExpired(): boolean {
    return this.props.expiresAt.getTime() <= Date.now();
  }

  isPending(): boolean {
    return this.props.status === PaymentAuthorizationStatus.PENDING;
  }

  isAuthorized(): boolean {
    return this.props.status === PaymentAuthorizationStatus.AUTHORIZED;
  }

  authorize(): void {
    if (!this.isPending()) {
      throw new Error("Authorization is not pending.");
    }

    if (this.isExpired()) {
      this.expire();

      throw new Error("Authorization has expired.");
    }

    this.props.status = PaymentAuthorizationStatus.AUTHORIZED;

    this.props.authorizedAt = new Date();

    this.props.updatedAt = new Date();
  }

  consume(): void {
    if (!this.isAuthorized()) {
      throw new Error("Authorization is not authorized.");
    }

    if (this.isExpired()) {
      this.expire();

      throw new Error("Authorization has expired.");
    }

    this.props.status = PaymentAuthorizationStatus.CONSUMED;

    this.props.consumedAt = new Date();

    this.props.updatedAt = new Date();
  }

  expire(): void {
    if (this.props.status === PaymentAuthorizationStatus.CONSUMED) {
      return;
    }

    this.props.status = PaymentAuthorizationStatus.EXPIRED;

    this.props.updatedAt = new Date();
  }

  revoke(): void {
    if (this.props.status === PaymentAuthorizationStatus.CONSUMED) {
      throw new Error("Consumed authorization cannot be revoked.");
    }

    this.props.status = PaymentAuthorizationStatus.REVOKED;

    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get paymentRequestId(): string {
    return this.props.paymentRequestId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get method(): PaymentAuthorizationMethod {
    return this.props.method;
  }

  get channel(): PaymentAuthorizationChannel {
    return this.props.channel;
  }

  get status(): PaymentAuthorizationStatus {
    return this.props.status;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get authorizedAt(): Date | null {
    return this.props.authorizedAt;
  }

  get consumedAt(): Date | null {
    return this.props.consumedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
