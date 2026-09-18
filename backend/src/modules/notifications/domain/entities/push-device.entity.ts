import { randomUUID } from "crypto";

export interface PushDeviceProps {
  id: string;
  userId: string;
  token: string;
  platform: string;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class PushDevice {
  constructor(private readonly props: PushDeviceProps) {}

  static create(params: {
    userId: string;
    platform: string;
    token: string;
  }): PushDevice {
    const now = new Date();
    return new PushDevice({
      id: randomUUID(),
      ...params,
      lastSeenAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(params: PushDeviceProps): PushDevice {
    return new PushDevice(params);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get platform(): string {
    return this.props.platform;
  }

  get lastSeenAt(): Date {
    return this.props.lastSeenAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  touch(): void {
    const now = new Date();

    this.props.lastSeenAt = now;
    this.props.updatedAt = now;
  }
}
