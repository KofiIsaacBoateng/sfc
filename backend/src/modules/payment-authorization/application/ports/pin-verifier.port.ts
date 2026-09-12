export interface PinVerifier {
  verify(params: { userId: string; pin: string }): Promise<boolean>;
}
