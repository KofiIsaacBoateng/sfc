import BadRequestError from "@/shared/errors/bad-request.js";
import { randomUUID } from "crypto";

export enum ProvisionedDeviceStatus {
  AVAILABLE = "AVAILABLE",
  CLAIMED = "CLAIMED",
  REVOKED = "REVOKED",
  RETIRED = "RETIRED",
}

export enum ProvisionedDeviceType {
  CARD = "CARD",
  BRACELET = "BRACELET",
  RING = "RING",
  KEYCHAIN = "KEYCHAIN",
  STICKER = "STICKER",
}

export enum SecurityTier {
  BASIC = "BASIC",
  SECURE = "SECURE",
}

export interface ProvisionedDeviceProps {
  id: string;
  editionId: string;
  serialNumber: string;
  activationCodeHash: string;
  deviceType: ProvisionedDeviceType;
  securityTier: SecurityTier;
  status: ProvisionedDeviceStatus;
  claimedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ProvisionedDevice {
  private constructor(private props: ProvisionedDeviceProps) {}

  static create(input: {
    editionId: string;
    serialNumber: string;
    activationCodeHash: string;
    deviceType: ProvisionedDeviceType;
    securityTier: SecurityTier;
  }): ProvisionedDevice {
    return new ProvisionedDevice({
      id: randomUUID(),
      ...input,
      status: ProvisionedDeviceStatus.AVAILABLE,
      claimedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(input: ProvisionedDeviceProps): ProvisionedDevice {
    return new ProvisionedDevice(input);
  }

  claim = () => {
    if (this.props.status === "AVAILABLE") {
      throw new BadRequestError(undefined, "Device cannot be claimed");
    }

    return new ProvisionedDevice({
      ...this.props,
      status: ProvisionedDeviceStatus.AVAILABLE,
      claimedAt: new Date(),
      updatedAt: new Date(),
    });
  };

  get id(): string {
    return this.props.id;
  }

  get editionId(): string {
    return this.props.editionId;
  }

  get serialNumber(): string {
    return this.props.serialNumber;
  }

  get activationCodeHash(): string {
    return this.props.activationCodeHash;
  }

  get deviceType(): ProvisionedDeviceType {
    return this.props.deviceType;
  }

  get securityTier(): SecurityTier {
    return this.props.securityTier;
  }

  get status(): ProvisionedDeviceStatus {
    return this.props.status;
  }

  get claimedAt(): Date | null {
    return this.props.claimedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
