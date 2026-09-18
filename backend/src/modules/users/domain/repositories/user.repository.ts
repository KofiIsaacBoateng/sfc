import type { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";
import { User } from "../entities/user.entity.js";

export interface UserRepository {
  /**
   * Finds a user by their Firebase UID.
   * @param firebaseUid
   * Returns null if no user exists.
   */
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;

  /**
   * Finds a user by their unique ID.
   * @param id
   * Useful for authenticated requests.
   */
  findById(userId: string): Promise<User | null>;

  /**
   * Finds a a user by their unique ID
   * @param phoneNumber
   * Returns null if no user exists
   */
  findByPhoneNumber(phoneNumber: PhoneNumber): Promise<User | null>;

  /**
   * Persists a new user.
   * @param user
   */
  create(user: User): Promise<User>;

  /**
   * Persists changes made to an existing user.
   * @param user
   */
  update(user: User): Promise<User>;

  /**
   * Checks whether a Firebase UID already exists.
   * @param firebaseUid
   */
  existsByFirebaseUid(firebaseUid: string): Promise<boolean>;
}
