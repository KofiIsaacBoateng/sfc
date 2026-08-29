import type { PaymentAuthorizationChannel } from "@/generated/client/enums.js";

export interface AuthorizeBasicPaymentDto {
  paymentRequestId: string;
  pin: string;
  channel: PaymentAuthorizationChannel;
}
