import type {
  SecureSfcProof,
  SecureSfcProofVerifier,
} from "../../application/ports/secure-sfc-proof-verifier.port.js";

export class SecureSfcProofVerifierService implements SecureSfcProofVerifier {
  async verify(params: {
    deviceId: string;
    proof: SecureSfcProof;
  }): Promise<boolean> {
    /*
     * Step 1:
     * Load the cryptographic material associated
     * with params.deviceId from protected storage.
     */

    /*
     * Step 2:
     * Verify the cryptogram against the exact
     * provisioning configuration used for this
     * SFC device.
     */

    const cryptographicallyValid = await this.verifyCryptogram(
      params.deviceId,
      params.proof,
    );

    if (!cryptographicallyValid) {
      return false;
    }

    /*
     * Step 3:
     * Atomically validate and consume the counter.
     *
     * The implementation must guarantee:
     *
     * newCounter > previouslyAcceptedCounter
     *
     * and the comparison/update must happen
     * atomically to prevent concurrent replay.
     */
    return this.acceptCounter(params.deviceId, params.proof.counter);
  }

  private async verifyCryptogram(
    deviceId: string,
    proof: SecureSfcProof,
  ): Promise<boolean> {
    /*
     * Implement against the actual SFC/NTAG
     * provisioning protocol.
     */
    return false;
  }

  private async acceptCounter(
    deviceId: string,
    counter: bigint,
  ): Promise<boolean> {
    /*
     * Implement as an atomic database operation.
     *
     * Example conceptually:
     *
     * UPDATE ...
     * SET lastCounter = counter
     * WHERE deviceId = ...
     * AND lastCounter < counter
     *
     * return rowsAffected === 1;
     */

    return false;
  }
}
