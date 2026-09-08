import type { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import BadRequestError from "@/shared/errors/bad-request.js";
import { randomUUID } from "node:crypto";

export enum PaymentRequestStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export interface PaymentRequestProps {
  id: string;
  requesterId: string;
  amount: bigint;
  feeAmount: bigint;
  totalAmount: bigint;
  currency: Currency;
  reference: string;
  status: PaymentRequestStatus;
  idempotencyKey: string;
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
    feeAmount: bigint;
    currency: Currency;
    reference: string;
    expiresAt: Date;
    idempotencyKey: string;
  }): PaymentRequest {
    if (params.amount <= 0n) {
      throw new BadRequestError(
        "PAYMENT_REQUEST_ERROR",
        "Payment request amount must be greater than zero.",
      );
    }

    if (params.feeAmount < 0n) {
      throw new BadRequestError(
        "PAYMENT_REQUEST_ERROR",
        "Fee amount cannot be negative.",
      );
    }

    if (params.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestError(
        "PAYMENT_REQUEST_ERROR",
        "Payment request must expire in the future.",
      );
    }

    const now = new Date();

    const totalAmount = params.amount + params.feeAmount;

    return new PaymentRequest({
      id: randomUUID(),
      requesterId: params.requesterId,
      amount: params.amount,
      feeAmount: params.feeAmount,
      totalAmount,
      currency: params.currency,
      reference: params.reference,
      status: PaymentRequestStatus.PENDING,
      expiresAt: params.expiresAt,
      idempotencyKey: params.idempotencyKey,
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

  isProcessing(): boolean {
    return this.props.status === PaymentRequestStatus.PROCESSING;
  }

  isExpired(): boolean {
    return (
      this.props.status === PaymentRequestStatus.EXPIRED ||
      this.props.expiresAt.getTime() <= Date.now()
    );
  }

  startProcessing(): void {
    if (!this.isPending()) {
      throw new BadRequestError(
        "PAYMENT_REQUEST_ERROR",
        "Payment request is not pending.",
      );
    }

    this.props.status = PaymentRequestStatus.PROCESSING;

    this.props.updatedAt = new Date();
  }

  complete(transactionId: string): void {
    if (!this.isProcessing()) {
      throw new BadRequestError(
        "PAYMENT_REQUEST_ERROR",
        "Payment request is no longer processing.",
      );
    }

    if (this.isExpired()) {
      this.props.status = PaymentRequestStatus.EXPIRED;

      this.props.updatedAt = new Date();

      throw new BadRequestError(
        "PAYMENT_REQUEST_EXPIRED",
        "Payment request has expired.",
      );
    }

    this.props.status = PaymentRequestStatus.COMPLETED;

    this.props.transactionId = transactionId;

    this.props.updatedAt = new Date();
  }

  cancel(): void {
    if (!this.isPending()) {
      throw new BadRequestError(
        "PAYMENT_REQUEST_ERROR",
        "Only pending payment requests can be cancelled.",
      );
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

  get feeAmount(): bigint {
    return this.props.feeAmount;
  }

  get totalAmount(): bigint {
    return this.props.totalAmount;
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

  get idempotencyKey(): string {
    return this.props.idempotencyKey;
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
