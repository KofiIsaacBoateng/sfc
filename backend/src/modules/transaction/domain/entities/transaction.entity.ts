import type { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import BadRequestError from "@/shared/errors/bad-request.js";
import { randomUUID } from "crypto";

export enum TransactionType {
  PAYMENT = "PAYMENT",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  REFUND = "REFUND",
  REVERSAL = "REVERSAL",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export interface TransactionProps {
  id: string;
  reference: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: bigint;
  currency: Currency;
  initiatedBy: string;
  createdAt: Date;
}

export class Transaction {
  private constructor(private readonly props: TransactionProps) {}

  static createPayment(params: {
    reference: string;
    amount: bigint;
    initiatedBy: string;
    currency: Currency;
  }): Transaction {
    if (params.amount <= 0n) {
      throw new BadRequestError(
        "INVALID_AMOUNT",
        "Transaction amount must be greater than zero.",
      );
    }

    return new Transaction({
      id: randomUUID(),
      ...params,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      createdAt: new Date(),
    });
  }

  static restore(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  get id(): string {
    return this.props.id;
  }

  get reference(): string {
    return this.props.reference;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  get amount(): bigint {
    return this.props.amount;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get initiatedBy(): string {
    return this.props.initiatedBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
