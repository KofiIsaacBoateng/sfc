import { randomUUID } from "crypto";

export enum DeviceStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  LOST = "LOST",
  REVOKED = "REVOKED",
}

export interface SfcDeviceProps {
  id: string;
  userId: string;
  provisionedDeviceId: string;
  tagUid: string;
  status: DeviceStatus;
  lastAcceptedCounter: bigint | null;
  lastSeenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SfcDevice {
  private constructor(private props: SfcDeviceProps) {}

  static create(input: {
    userId: string;
    provisionedDeviceId: string;
    tagUid: string;
  }): SfcDevice {
    return new SfcDevice({
      id: randomUUID(),
      ...input,
      status: DeviceStatus.ACTIVE,
      lastAcceptedCounter: null,
      lastSeenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(input: SfcDeviceProps): SfcDevice {
    return new SfcDevice(input);
  }

  isActive(): boolean {
    return this.props.status === DeviceStatus.ACTIVE;
  }

  isBlocked(): boolean {
    return this.props.status === DeviceStatus.BLOCKED;
  }

  markAsSeen() {
    this.props.lastSeenAt = new Date();
    this.props.updatedAt = new Date();
  }

  block() {
    this.props.status = DeviceStatus.BLOCKED;
    this.props.updatedAt = new Date();
  }

  unblock() {
    this.props.status = DeviceStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  activate() {
    this.props.status = DeviceStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  markLost() {
    this.props.status = DeviceStatus.LOST;
    this.props.updatedAt = new Date();
  }

  revoke() {
    this.props.status = DeviceStatus.REVOKED;
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get provisionedDeviceId(): string {
    return this.props.provisionedDeviceId;
  }

  get tagUid(): string {
    return this.props.tagUid;
  }

  get status(): DeviceStatus {
    return this.props.status;
  }

  get lastAcceptedCounter(): bigint | null {
    return this.props.lastAcceptedCounter;
  }

  get lastSeenAt(): Date | null {
    return this.props.lastSeenAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
