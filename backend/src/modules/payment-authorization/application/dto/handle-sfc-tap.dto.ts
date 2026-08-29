import type { PaymentAuthorizationDuration } from "../../domain/entities/payment-authorization.entity.js";

export interface HandleSfcTapDto {
  paymentRequestId: string;
  tagData: string;
  authorizationDuration: PaymentAuthorizationDuration;
}
