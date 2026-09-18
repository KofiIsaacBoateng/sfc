import type { PushDevice as PrismaPushDevice } from "@/generated/client/client.js";
import { PushDevice } from "../../domain/entities/push-device.entity.js";

export class PushDeviceMapper {
  static toDomain(raw: PrismaPushDevice): PushDevice {
    return PushDevice.restore({ ...raw });
  }

  static toPersistence(pushDevice: PushDevice): PrismaPushDevice {
    return {
      id: pushDevice.id,
      userId: pushDevice.userId,
      token: pushDevice.token,
      platform: pushDevice.platform,
      lastSeenAt: pushDevice.lastSeenAt,
      createdAt: pushDevice.createdAt,
      updatedAt: pushDevice.updatedAt,
    };
  }
}
