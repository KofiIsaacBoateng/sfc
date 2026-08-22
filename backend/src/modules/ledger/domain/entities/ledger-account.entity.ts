import { randomUUID } from "crypto";

export enum LedgerAccountType {
  WALLET = "WALLET",
  REVENUE = "REVENUE",
}

interface LedgerAccountProps {
  id: string;
  walletId: string | null;
  accountType: LedgerAccountType;
  code: string | null;
  createdAt: Date;
}

export class LedgerAccount {
  private constructor(private props: LedgerAccountProps) {}

  static createWalletAccount(walletId: string): LedgerAccount {
    return new LedgerAccount({
      id: randomUUID(),
      walletId,
      accountType: LedgerAccountType.WALLET,
      code: null,
      createdAt: new Date(),
    });
  }

  static createRevenueAccount(code: string): LedgerAccount {
    return new LedgerAccount({
      id: randomUUID(),
      walletId: null,
      accountType: LedgerAccountType.REVENUE,
      code,
      createdAt: new Date(),
    });
  }

  static restore(props: LedgerAccountProps): LedgerAccount {
    return new LedgerAccount(props);
  }

  get id(): string {
    return this.props.id;
  }

  get walletId(): string | null {
    return this.props.walletId;
  }

  get accountType(): LedgerAccountType {
    return this.props.accountType;
  }

  get code(): string | null {
    return this.props.code;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
