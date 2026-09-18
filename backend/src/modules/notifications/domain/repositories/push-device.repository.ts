import type { PushDevice } from "../entities/push-device.entity.js";

export interface PushDeviceRepository {
  /**
   * Persists a newly created Push device
   * @param pushDevice
   * returns a newly created device
   */
  create(pushDevice: PushDevice): Promise<PushDevice>;

  /**
   * Persists an updated push device
   * @param pushDevice
   * returns the updated version of the device
   */
  update(pushDevice: PushDevice): Promise<PushDevice>;

  /**
   * Finds a push device by id
   * @param id
   * Return null if device not found
   */
  findById(id: string): Promise<PushDevice | null>;

  /**
   * Finds a push device by token
   * @param token
   * Return null if device not found
   */
  findByToken(token: string): Promise<PushDevice | null>;

  /**
   * Finds a push device by user ID
   * @param userId
   * Return a list of push devices for a user's account
   */
  findByUserId(userId: string): Promise<PushDevice[]>;
}
