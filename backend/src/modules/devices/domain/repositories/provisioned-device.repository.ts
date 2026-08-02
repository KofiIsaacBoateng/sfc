import type { ProvisionedDevice } from "../entities/provisioned-device.entity.js";

export interface ProvisionedDeviceRepository {
  /**
   * Retrieved provisioned sfc device by activation code
   * @param hash
   * Returns null if device isn't from our inventory
   */
  findByActivationCodeHash(hash: string): Promise<ProvisionedDevice | null>;

  /**
   * Updates provisioned device in our inventory
   * @param device
   * Returns the updated device entity
   */
  update(device: ProvisionedDevice): Promise<ProvisionedDevice>;
}
