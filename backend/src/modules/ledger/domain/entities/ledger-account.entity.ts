import { randomUUID } from "crypto";

interface LedgerAccountProps {
  id: string;
  walletId: string;
  createdAt: Date;
}

export class LedgerAccount {
  private constructor(private readonly props: LedgerAccountProps) {}

  static create(walletId: string): LedgerAccount {
    return new LedgerAccount({
      id: randomUUID(),
      walletId,
      createdAt: new Date(),
    });
  }

  static restore(props: LedgerAccountProps): LedgerAccount {
    return new LedgerAccount(props);
  }

  get id(): string {
    return this.props.id;
  }

  get walletId(): string {
    return this.props.walletId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
