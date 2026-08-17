import { randomUUID } from "crypto";
import type { PaymentRequestReferenceGenerator } from "../application/ports/payment-request-reference-generator.js";

export class DefaultPaymentRequestReferenceGenerator implements PaymentRequestReferenceGenerator {
  generate(): string {
    return `SFC_REQ-${Date.now()}-${randomUUID().split("-")[0]?.toUpperCase()}`;
  }
}
