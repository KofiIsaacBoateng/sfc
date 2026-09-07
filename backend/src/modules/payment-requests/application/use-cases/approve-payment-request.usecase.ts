import type { TransactionReferenceGenerator } from "@/modules/transaction/application/ports/transaction-reference-generator.js";
import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import { Transaction } from "@/modules/transaction/domain/entities/transaction.entity.js";
import NotFoundError from "@/shared/errors/not-found.js";
import BadRequestError from "@/shared/errors/bad-request.js";
import { EntryType } from "@/generated/client/enums.js";
import ConflictError from "@/shared/errors/conflict.js";
import UnauthorizedError from "@/shared/errors/unauthorized.js";

export class ApprovePaymentRequestUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly referenceGenerator: TransactionReferenceGenerator,
  ) {}

  async execute(
    senderUserId: string,
    paymentRequestId: string,
    authorizationId: string,
  ): Promise<Transaction> {
    return this.unitOfWork.execute(async (repos) => {
      /*** CONSUME AUTHORIZED PAYMENT */
      // load payment authorization
      const authorization =
        await repos.paymentAuthorization.findById(authorizationId);

      if (!authorization) {
        throw new UnauthorizedError(
          undefined,
          "Payment authorization is invalid, expired, or already consumed.",
        );
      }

      // Are we authorizing the right payment request?
      if (authorization.paymentRequestId !== paymentRequestId) {
        throw new ConflictError(
          undefined,
          "Payment authorization does not belong to this payment request.",
        );
      }

      // Does the authorization belong to the authenticatedf sender?
      if (authorization.userId !== senderUserId) {
        throw new UnauthorizedError(
          undefined,
          "Payment authorization does not belong to the authenticated user.",
        );
      }

      // Claim(consume) payment authorization here!
      const claimedAuthorization =
        await repos.paymentAuthorization.claimAuthorized(
          authorizationId,
          senderUserId,
        );

      if (!claimedAuthorization) {
        throw new UnauthorizedError(
          undefined,
          "Payment authorization is invalid, expired, or already consumed.",
        );
      }

      /** CLAIM PAYMENT REQUEST */
      const paymentRequest =
        await repos.paymentRequest.claimPending(paymentRequestId);

      if (!paymentRequest) {
        throw new ConflictError(
          "PAYMENT_REQUEST_ERROR",
          "Payment request is unavailable, expired, or already being processed.",
        );
      }

      /** validate sender and verify that they have an active wallet */
      const senderWallet = await repos.wallets.findByUserId(senderUserId);

      if (!senderWallet) {
        throw new NotFoundError("WALLET_NOT_FOUND", "Sender wallet not found.");
      }

      if (!senderWallet.isActive()) {
        throw new BadRequestError(
          "WALLET_IS_INACTIVE",
          "Sender wallet is not active.",
        );
      }

      /** avoid currency mismatch and same wallet transfer  */
      if (senderWallet.currency !== paymentRequest.currency) {
        throw new BadRequestError("CURRENCY_MISMATCH", "Currency mismatch.");
      }

      if (senderWallet.userId === paymentRequest.requesterId) {
        throw new BadRequestError(
          "SELF_PAYMENT_NOT_ALLOWED",
          "Cannot approve your own payment request.",
        );
      }

      /** verify merchant available */
      const merchantWallet = await repos.wallets.findByUserId(
        paymentRequest.requesterId,
      );

      if (!merchantWallet) {
        throw new BadRequestError(
          "WALLET_NOT_FOUND",
          "Recipient wallet not found.",
        );
      }

      /** locate sender, merchant, and fee ledger accounts */
      const senderLedgerAccount = await repos.ledger.findByWalletId(
        senderWallet.id,
      );

      const merchantLedgerAccount = await repos.ledger.findByWalletId(
        merchantWallet.id,
      );

      const feeLedgerAccount =
        await repos.ledger.findByCode("SFC_PAYMENT_FEES");

      if (!senderLedgerAccount) {
        throw new NotFoundError(
          "LEDGER_ACCOUNT_NOT_FOUND",
          "Sender ledger account not found.",
        );
      }

      if (!merchantLedgerAccount) {
        throw new NotFoundError(
          "LEDGER_ACCOUNT_NOT_FOUND",
          "Merchant ledger account not found.",
        );
      }

      if (!feeLedgerAccount) {
        throw new NotFoundError(
          "LEDGER_ACCOUNT_NOT_FOUND",
          "SFC fee ledger account not found.",
        );
      }

      /*
       * Actual balance changes.
       *
       * Sender pays TOTAL.
       * Merchant receives AMOUNT.
       * SFC receives FEE.
       */
      await repos.wallets.debit(senderWallet.id, paymentRequest.totalAmount);

      await repos.wallets.credit(merchantWallet.id, paymentRequest.amount);

      const transaction = Transaction.createPayment({
        reference: this.referenceGenerator.generate(),

        amount: paymentRequest.totalAmount, // transaction records total amount = amount + fee

        currency: paymentRequest.currency,

        initiatedBy: senderUserId,
      });

      await repos.transaction.create(transaction);

      /*
       * One debit, two credits.
       *
       * Total:
       * DEBIT  = amount + fee => sender
       * CREDIT = amount => recipient
       * CREDIT = fee => sfc
       */
      await repos.ledgerEntries.create({
        transactionId: transaction.id,
        ledgerAccountId: senderLedgerAccount.id,
        entryType: EntryType.DEBIT,
        amount: paymentRequest.totalAmount,
      });

      await repos.ledgerEntries.create({
        transactionId: transaction.id,
        ledgerAccountId: merchantLedgerAccount.id,
        entryType: EntryType.CREDIT,
        amount: paymentRequest.amount,
      });

      if (paymentRequest.feeAmount > 0n) {
        await repos.ledgerEntries.create({
          transactionId: transaction.id,
          ledgerAccountId: feeLedgerAccount.id,
          entryType: EntryType.CREDIT,
          amount: paymentRequest.feeAmount,
        });
      }

      // mark payment request as resolved (COMPLETE)
      paymentRequest.complete(transaction.id);

      await repos.paymentRequest.update(paymentRequest);

      return transaction;
    });
  }
}
