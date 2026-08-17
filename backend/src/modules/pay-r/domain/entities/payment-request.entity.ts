import type { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import { randomUUID } from "node:crypto";

export enum PaymentRequestStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export interface PaymentRequestProps {
  id: string;
  requesterId: string;
  amount: bigint;
  currency: Currency;
  reference: string;
  status: PaymentRequestStatus;
  expiresAt: Date;
  transactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentRequest {
  private constructor(private props: PaymentRequestProps) {}

  static create(params: {
    requesterId: string;
    amount: bigint;
    currency: Currency;
    reference: string;
    expiresAt: Date;
  }): PaymentRequest {
    if (params.amount <= 0n) {
      throw new Error("Payment request amount must be greater than zero.");
    }

    if (params.expiresAt.getTime() <= Date.now()) {
      throw new Error("Payment request must expire in the future.");
    }

    const now = new Date();

    return new PaymentRequest({
      id: randomUUID(),
      requesterId: params.requesterId,
      amount: params.amount,
      currency: params.currency,
      reference: params.reference,
      status: PaymentRequestStatus.PENDING,
      expiresAt: params.expiresAt,
      transactionId: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: PaymentRequestProps): PaymentRequest {
    return new PaymentRequest(props);
  }

  isPending(): boolean {
    return this.props.status === PaymentRequestStatus.PENDING;
  }

  isExpired(): boolean {
    return (
      this.props.status === PaymentRequestStatus.EXPIRED ||
      this.props.expiresAt.getTime() <= Date.now()
    );
  }

  complete(transactionId: string): void {
    if (!this.isPending()) {
      throw new Error("Payment request is no longer pending.");
    }

    if (this.isExpired()) {
      this.props.status = PaymentRequestStatus.EXPIRED;

      this.props.updatedAt = new Date();

      throw new Error("Payment request has expired.");
    }

    this.props.status = PaymentRequestStatus.COMPLETED;

    this.props.transactionId = transactionId;

    this.props.updatedAt = new Date();
  }

  cancel(): void {
    if (!this.isPending()) {
      throw new Error("Only pending payment requests can be cancelled.");
    }

    this.props.status = PaymentRequestStatus.CANCELLED;

    this.props.updatedAt = new Date();
  }

  expire(): void {
    if (this.isPending()) {
      this.props.status = PaymentRequestStatus.EXPIRED;

      this.props.updatedAt = new Date();
    }
  }

  get id(): string {
    return this.props.id;
  }

  get requesterId(): string {
    return this.props.requesterId;
  }

  get amount(): bigint {
    return this.props.amount;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get reference(): string {
    return this.props.reference;
  }

  get status(): PaymentRequestStatus {
    return this.props.status;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get transactionId(): string | null {
    return this.props.transactionId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
