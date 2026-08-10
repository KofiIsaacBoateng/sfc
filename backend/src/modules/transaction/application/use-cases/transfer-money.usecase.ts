import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import { randomUUID } from "crypto";
import type { TransferMoneyDto } from "../dto/transfer-money.dto.js";
import { Transaction } from "../../domain/entities/transaction.entity.js";
import type { Repositories } from "@/shared/application/unit-of-work/repositories.js";
import BadRequestError from "@/shared/errors/bad-request.js";
import NotFoundError from "@/shared/errors/not-found.js";
import { EntryType } from "@/generated/client/enums.js";

function generateTransactionReferenece(): string {
  return `SFC-${Date.now()}-${randomUUID().split("-")[0]?.toUpperCase()}`;
}

export class TransferMoneyUseCase {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async execute(
    senderUserId: string,
    dto: TransferMoneyDto,
  ): Promise<Transaction> {
    const amount = BigInt(dto.amount);

    if (amount <= 0) {
      throw new BadRequestError(
        "INVALID_AMOUNT",
        "Transfer amount must be greater than zero",
      );
    }
    return this.unitOfWork.execute(
      async (repos: Repositories): Promise<Transaction> => {
        /** find sender wallet */
        const senderWallet = await repos.wallets.findByUserId(senderUserId);
        if (!senderWallet) {
          throw new NotFoundError(
            "WALLET_NOT_FOUND",
            "Sender wallet not found.",
          );
        }

        /** find recipient wallet */
        const recipientWallet = await repos.wallets.findById(
          dto.recipientWalletId,
        );
        if (!recipientWallet) {
          throw new NotFoundError(
            "WALLET_NOT_FOUND",
            "Recipient wallet not found.",
          );
        }

        /** check for same wallet transfers */
        if (senderWallet.id === recipientWallet.id) {
          throw new BadRequestError(
            "SELF_PAYMENT_NOT_ALLOWED",
            "Cannot transfer from a wallet to itself.",
          );
        }

        /*** check for currency mismatch */
        if (senderWallet.currency !== dto.currency) {
          throw new BadRequestError(
            "CURRENCY_MISMATCH",
            "Sender wallet currency mismatch.",
          );
        }
        if (recipientWallet.currency !== dto.currency) {
          throw new BadRequestError(
            "CURRENCY_MISMATCH",
            "Recipient wallet currency mismatch.",
          );
        }

        /*** locate sender ledger account */
        const senderLedgerAccount = await repos.ledger.findByWalletId(
          senderWallet.id,
        );
        if (!senderLedgerAccount) {
          throw new BadRequestError(
            "LEDGER_ACCOUNT_NOT_FOUND",
            "Sender ledger account not found.",
          );
        }

        /** locate recipient ledger account */
        const recipientLedgerAccount = await repos.ledger.findByWalletId(
          recipientWallet.id,
        );
        if (!recipientLedgerAccount) {
          throw new BadRequestError(
            "LEDGER_ACCOUNT_NOT_FOUND",
            "Recipient ledger account not found.",
          );
        }

        /*** Repository atomic balance minor changes */
        await repos.wallets.debit(senderWallet.id, amount); // debit sender wallet
        await repos.wallets.credit(recipientWallet.id, amount); // credit recipient wallet

        /** create transaction and persist data */
        const transaction = Transaction.createPayment({
          reference: generateTransactionReferenece(),
          amount,
          initiatedBy: senderUserId,
          currency: dto.currency,
        });
        await repos.transaction.create(transaction);

        /** create sender ledger entry */
        await repos.ledgerEntries.create({
          transactionId: transaction.id,

          ledgerAccountId: senderLedgerAccount.id,

          entryType: EntryType.DEBIT,

          amount,
        });

        /** create recipient ledger entry */
        await repos.ledgerEntries.create({
          transactionId: transaction.id,

          ledgerAccountId: recipientLedgerAccount.id,

          entryType: EntryType.CREDIT,

          amount,
        });

        /*** return transaction entity */
        return transaction;
      },
    );
  }
}
