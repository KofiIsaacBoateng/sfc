import type { PaymentAuthorizationDuration } from "../../domain/entities/payment-authorization.entity.js";

import type { SecureSfcProof } from "@/modules/devices/application/ports/secure-sfc-proof-verifier.port.js";

export interface HandleSfcTapDto {
  paymentRequestId: string;
  tagData: string;
  secureSfcProof?: SecureSfcProof;
  authorizationDuration: PaymentAuthorizationDuration;
}
