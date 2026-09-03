export interface SecureSfcProof {
  uid: string;
  counter: bigint;
  cryptogram: string;
}

export interface SfcProofReplayStore {
  acceptCounter(deviceId: string, counter: bigint): Promise<boolean>;
}

export interface SecureSfcCryptographicVerifier {
  verify(params: {
    provisionedDeviceId: string;
    proof: SecureSfcProof;
  }): Promise<boolean>;
}

export interface SecureSfcProofVerifier {
  verify(params: {
    deviceId: string;
    provisionedDeviceId: string;
    proof: SecureSfcProof;
  }): Promise<boolean>;
}
