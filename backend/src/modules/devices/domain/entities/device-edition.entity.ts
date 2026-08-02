import { randomUUID } from "crypto";

interface DeviceEditionProps {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isLimited: boolean;
  maxDevices: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class DeviceEdition {
  private constructor(private readonly props: DeviceEditionProps) {}

  static create(input: {
    code: string;
    name: string;
    description?: string;
    isLimited?: boolean;
    maxDevices?: number;
  }): DeviceEdition {
    return new DeviceEdition({
      id: randomUUID(),
      code: input.code,
      name: input.name,
      description: input.description ?? null,
      isLimited: input.isLimited ?? false,
      maxDevices: input.maxDevices ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(input: DeviceEditionProps): DeviceEdition {
    return new DeviceEdition(input);
  }

  get id(): string {
    return this.props.id;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get isLimited(): boolean {
    return this.props.isLimited;
  }

  get maxDevices(): number | null {
    return this.props.maxDevices;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
