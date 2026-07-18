import { randomUUID } from "crypto";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  LOCKED = "LOCKED",
  CLOSED = "CLOSED",
}

export enum Currency {
  GHS = "GHS",
}

interface WalletProps {
  id: string;
  userId: string;
  status: WalletStatus;
  currency: Currency;
  updatedAt: Date;
  createdAt: Date;
}

export class Wallet {
  private constructor(private readonly props: WalletProps) {}

  static create(userId: string, currency: Currency = Currency.GHS): Wallet {
    return new Wallet({
      id: randomUUID(),
      userId,
      currency,
      status: WalletStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: WalletProps): Wallet {
    return new Wallet(props);
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

  activate(): WalletProps {
    return new Wallet({
      ...this.props,
      status: WalletStatus.ACTIVE,
      updatedAt: new Date(),
    });
  }

  lock(): WalletProps {
    return new Wallet({
      ...this.props,
      status: WalletStatus.LOCKED,
      updatedAt: new Date(),
    });
  }

  close(): WalletProps {
    return new Wallet({
      ...this.props,
      status: WalletStatus.CLOSED,
      updatedAt: new Date(),
    });
  }
}
