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
  findByTagUid(tagUid: string): Promise<SfcDevice | null>;

  /**
   * Finds a device by the userId
   * @param userId
   * Returns a new device
   */
  findByUserId(userId: string): Promise<SfcDevice[]>;

  /**
   * Persists changes made to a device
   * @param device
   * Returns a device
   */
  update(device: SfcDevice): Promise<SfcDevice>;

  /**
   * Finds a device by the provisioned id
   * @param provisionedDeviceId
   * Returns a device
   */
  findByProvisionedDeviceId(
    provisionedDeviceId: string,
  ): Promise<SfcDevice | null>;

  /**
   * Compares and persists an updated cryptographic counter
   * @param deviceId
   * @param counter
   * Returns true if the comparison is a match else...
   */
  acceptSecureCounter(deviceId: string, counter: bigint): Promise<boolean>;
}
