export interface PaymentRealtimeChannel {
  notifyMerchantWaiting(params: {
    paymentRequestId: string;
    merchantUserId: string;
  }): Promise<void>;

  notifyCustomerAuthorizationRequired(params: {
    paymentRequestId: string;
    authorizationId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void>;

  notifyAuthorizationResult(params: {
    paymentRequestId: string;
    userId: string;
    authorized: boolean;
  }): Promise<void>;

  notifyPaymentCompleted(params: {
    paymentRequestId: string;
    merchantUserId: string;
    customerUserId: string;
  }): Promise<void>;

  notifyPaymentFailed(params: {
    paymentRequestId: string;
    merchantUserId: string;
    customerUserId: string;
    reason: string;
  }): Promise<void>;
}
