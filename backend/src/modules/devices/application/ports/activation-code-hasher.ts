export interface ActivationCodeHasher {
  /**
   * Encrypts device activation code
   * @param activationCode
   * Returns a hashed string
   */
  hash(activationCode: string): Promise<string>;
}
