export interface SecureSfcProof {
  uid: string;
  counter: bigint;
  cryptogram: string;
}
/** implemented by the device repository for now */
export interface SfcProofReplayStore {
  acceptCounter(deviceId: string, counter: bigint): Promise<boolean>;
}

export interface SecureSfcCryptographicVerifier {
  verify(params: {
    provisionedDeviceId: string;
    secureSfcProof: SecureSfcProof;
  }): Promise<boolean>;
}

export interface SecureSfcProofVerifier {
  verify(params: {
    deviceId: string;
    provisionedDeviceId: string;
    secureSfcProof: SecureSfcProof;
  }): Promise<boolean>;
}
