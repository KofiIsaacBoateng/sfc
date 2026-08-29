export interface PaymentAuthorizationNotifier {
  notifyAuthorizationRequired(params: {
    paymentRequestId: string;
    userId: string;
    authorizationId: string;
    expiresAt: Date;
  }): Promise<void>;

  notifyAuthorizationResult(params: {
    paymentRequestId: string;
    userId: string;
    authorized: boolean;
  }): Promise<void>;
}
