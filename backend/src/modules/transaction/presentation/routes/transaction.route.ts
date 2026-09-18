import { Router } from "express";

import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

import { TransactionController } from "../controllers/transaction.controller.js";
import { validateSchema } from "@/shared/presentation/validation/validation.schema.js";
import { transferSchema } from "../validators/transfer.validator.js";

export function buildTransactionRoutes(
  controller: TransactionController,
  jwtSecret: string,
): Router {
  const router = Router();

  /**
   * @openapi
   * /api/v1/transactions/transfer:
   *   post:
   *     tags:
   *       - Transactions
   *     summary: Transfer money to another wallet
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - recipientWalletId
   *               - amount
   *               - currency
   *             properties:
   *               recipientWalletId:
   *                 type: string
   *                 example: wallet_123
   *               amount:
   *                 type: string
   *                 example: "5000"
   *                 description: Amount in minor currency units
   *               currency:
   *                 type: string
   *                 enum:
   *                   - GHS
   *                 example: GHS
   *     responses:
   *       201:
   *         description: Transfer completed
   *       400:
   *         description: Invalid transfer request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Wallet or ledger account not found
   *       409:
   *         description: Transfer rejected
   */

  router.post(
    "/transfer",
    requireAuth(jwtSecret),
    validateSchema(transferSchema),
    controller.transfer.bind(controller),
  );

  /**
   * @openapi
   * /api/v1/transactions:
   *   get:
   *     tags:
   *       - Transactions
   *     summary: Get authenticated user's transaction history
   *     description: Returns the transactions initiated by the authenticated user, ordered from newest to oldest.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Transaction history retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TransactionResponse'
   *       401:
   *         description: Authentication required.
   */
  router.get(
    "/",
    requireAuth(jwtSecret),
    controller.getMyTransactions.bind(controller),
  );

  return router;
}
