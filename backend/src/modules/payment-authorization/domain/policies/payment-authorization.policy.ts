import { SecurityTier } from "@/modules/devices/domain/entities/provisioned-device.entity.js";
import type { Currency } from "@/shared/domain/value-objects/currency.vo.js";

export interface PaymentAuthorizationPolicy {
  requiresCustomerAuthorization(params: {
    amount: bigint;
    currency: Currency;
    securityTier: SecurityTier;
  }): boolean;
}

export class DefaultPaymentAuthorizationPolicy implements PaymentAuthorizationPolicy {
  requiresCustomerAuthorization(params: {
    amount: bigint;
    currency: Currency;
    securityTier: SecurityTier;
  }): boolean {
    return params.securityTier === SecurityTier.BASIC;
  }
}
