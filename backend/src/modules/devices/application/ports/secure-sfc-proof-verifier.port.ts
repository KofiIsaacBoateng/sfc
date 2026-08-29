export interface SecureSfcProof {
  uid: string;
  counter: bigint;
  cryptogram: string;
}

export interface SfcProofReplayStore {
  acceptCounter(deviceId: string, counter: bigint): Promise<boolean>;
}

export interface SecureSfcProofVerifier {
  verify(params: { deviceId: string; proof: SecureSfcProof }): Promise<boolean>;
}
