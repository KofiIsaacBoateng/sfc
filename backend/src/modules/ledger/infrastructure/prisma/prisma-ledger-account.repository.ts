import type {
  LedgerAccount as PrismaLedgerAccount,
  Prisma,
  PrismaClient,
} from "@/src/generated/client/client.js";
import type { LedgerAccountRepository } from "../../domain/repositories/ledger-account.repository.js";
import type { LedgerAccount } from "../../domain/entities/ledger-account.entity.js";
import { LedgerAccountMapper } from "./ledger-account.mapper.js";

type PrismaExecuter = Prisma.TransactionClient | PrismaClient;

export class PrismaLedgerAccountRepository implements LedgerAccountRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  private toDomainOrNull(
    raw: PrismaLedgerAccount | null,
  ): LedgerAccount | null {
    return raw ? LedgerAccountMapper.toDomain(raw) : null;
  }

  async findByWalletId(walletId: string): Promise<LedgerAccount | null> {
    const ledgerAccount = await this.prisma.ledgerAccount.findUnique({
      where: { walletId },
    });

    return this.toDomainOrNull(ledgerAccount);
  }

  async create(ledgerAccount: LedgerAccount): Promise<LedgerAccount> {
    const created = await this.prisma.ledgerAccount.create({
      data: LedgerAccountMapper.toPersistence(ledgerAccount),
    });

    return LedgerAccountMapper.toDomain(created);
  }
}
