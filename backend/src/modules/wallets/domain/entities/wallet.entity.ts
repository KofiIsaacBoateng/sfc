import { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import BadRequestError from "@/shared/errors/bad-request.js";
import { randomUUID } from "crypto";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  LOCKED = "LOCKED",
  CLOSED = "CLOSED",
}

interface WalletProps {
  id: string;
  userId: string;
  status: WalletStatus;
  balanceMinor: bigint;
  currency: Currency;
  updatedAt: Date;
  createdAt: Date;
}

export class Wallet {
  private constructor(private props: WalletProps) {}

  static create(userId: string, currency: Currency = Currency.GHS): Wallet {
    return new Wallet({
      id: randomUUID(),
      userId,
      currency,
      status: WalletStatus.ACTIVE,
      balanceMinor: 0n,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: WalletProps): Wallet {
    return new Wallet(props);
  }

  debit(amountMinor: number) {
    if (amountMinor <= 0n) {
      throw new BadRequestError(
        "INVALID_AMOUNT",
        "Debit amount must be greater than zero.",
      );
    }

    if (!this.isActive()) {
      throw new BadRequestError("WALLET_IS_INACTIVE", "Wallet must be active.");
    }

    if (this.props.balanceMinor < amountMinor) {
      throw new BadRequestError("INSUFFICIENT_FUNDS", "Insufficient funds!");
    }

    this.props.balanceMinor -= BigInt(amountMinor);
    this.props.updatedAt = new Date();
  }

  credit(amountMinor: number) {
    if (amountMinor <= 0n) {
      throw new BadRequestError(
        "INVALID_AMOUNT",
        "Credit amount must be greater than zero.",
      );
    }

    if (!this.isActive()) {
      throw new BadRequestError("WALLET_IS_INACTIVE", "Wallet must be active.");
    }

    this.props.balanceMinor += BigInt(amountMinor);
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get balanceMinor(): bigint {
    return this.props.balanceMinor;
  }

  get status(): WalletStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isActive(): boolean {
    return this.props.status === WalletStatus.ACTIVE;
  }

  activate() {
    this.props.status = WalletStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  lock() {
    this.props.status = WalletStatus.LOCKED;
    this.props.updatedAt = new Date();
  }

  close() {
    this.props.status = WalletStatus.CLOSED;
    this.props.updatedAt = new Date();
  }
}
