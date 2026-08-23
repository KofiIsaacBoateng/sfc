import type { ProvisionedDevice } from "../entities/provisioned-device.entity.js";

export interface ProvisionedDeviceRepository {
  /**
   * Retrieve a provisioned device by its id
   * @param id
   * Return null if device doesn't exist
   */
  findById(id: string): Promise<ProvisionedDevice | null>;

  /**
   * Retrieved provisioned sfc device by activation code
   * @param hash
   * Returns null if device doesn't exist our inventory
   */
  findByActivationCodeHash(hash: string): Promise<ProvisionedDevice | null>;

  /**
   * Find provisioned sfc device by serial number
   * @param serialNumber
   * Returns null if device doesn't exist in our inventory
   */
  findBySerialNumber(serialNumber: string): Promise<ProvisionedDevice | null>;

  /**
   * Persist created provisioned sfc device
   * @param device
   * Returns an updated device entity
   */
  create(device: ProvisionedDevice): Promise<ProvisionedDevice>;

  /**
   * Updates provisioned device in our inventory
   * @param device
   * Returns the updated device entity
   */
  update(device: ProvisionedDevice): Promise<ProvisionedDevice>;
}
