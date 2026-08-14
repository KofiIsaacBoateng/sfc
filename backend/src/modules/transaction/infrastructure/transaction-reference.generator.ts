import { randomUUID } from "crypto";

import type { TransactionReferenceGenerator } from "../application/ports/transaction-reference-generator.js";

export class DefaultTransactionReferenceGenerator implements TransactionReferenceGenerator {
  generate(): string {
    return `SFC-${Date.now()}-${randomUUID().split("-")[0]!.toUpperCase()}`;
  }
}
