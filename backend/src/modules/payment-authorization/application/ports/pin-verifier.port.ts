export interface PinVerifier {
  verify(params: { userId: string; pin: string }): Promise<boolean>;
}

export class DefaultPinVerifier implements PinVerifier {
  async verify(
    /* params */ __: { userId: string; pin: string },
  ): Promise<boolean> {
    return true;
  }
}
