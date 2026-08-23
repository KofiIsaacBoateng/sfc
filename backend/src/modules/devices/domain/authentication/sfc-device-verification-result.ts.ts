export enum SfcSecurityTier {
  BASIC = "BASIC",
  SECURE = "SECURE",
}

export interface SfcDeviceVerificationResult {
  verified: boolean;
  deviceId: string;
  userId: string;
  securityTier: SfcSecurityTier;
}
