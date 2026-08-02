import type { SfcDevice } from "../entities/sfc-device.entity.js";

export interface DeviceRepository {
  /**
   * creates a new sfc device and persists in the database
   * @param device
   * Returns a new device
   */
  create(device: SfcDevice): Promise<SfcDevice>;

  /**
   * Finds a device by their tag's UID
   * @param tagUid
   * Returns a new device
   */
  findByTagUid(tagUid: string): Promise<SfcDevice>;

  /**
   * Finds a device by the userId
   * @param userId
   * Returns a new device
   */
  findByUserId(userId: string): Promise<SfcDevice>;
}
