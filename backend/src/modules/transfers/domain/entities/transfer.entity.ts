import BadRequestError from "@/shared/errors/bad-request.js";
import { randomUUID } from "crypto";

export enum TransferStatus {
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export interface TransferProps {
  id: string;
  senderWalletId: string;
  recipientWalletId: string;
  amount: bigint;
  status: TransferStatus;
  reference: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface CreateTransferProps {
  senderWalletId: string;
  recipientWalletId: string;
  amount: bigint;
  reference?: string;
}

export class Transfer {
  private constructor(private readonly props: TransferProps) {}

  static create(params: CreateTransferProps) {
    if (params.amount <= 0n) {
      throw new BadRequestError(
        "INVALID_AMOUNT",
        "Transfer amount must be greater thatn zero.",
      );
    }

    if (params.senderWalletId === params.recipientWalletId) {
      throw new BadRequestError(
        "SELF_PAYMENT_NOT_ALLOWED",
        "Sender and recipient wallets must be different",
      );
    }

    const now = new Date();
    return new Transfer({
      id: randomUUID(),
      senderWalletId: params.senderWalletId,
      recipientWalletId: params.recipientWalletId,
      amount: params.amount,
      reference: params.reference ?? null,
      status: TransferStatus.COMPLETED,
      createdAt: now,
      completedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get senderWalletId(): string {
    return this.props.senderWalletId;
  }

  get recipientWalletId(): string {
    return this.props.recipientWalletId;
  }

  get amount(): bigint {
    return this.props.amount;
  }

  get status(): TransferStatus {
    return this.props.status;
  }

  get reference(): string | null {
    return this.props.reference;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }
}
