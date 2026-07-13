import { User } from "../entities/user.entity.js";

export interface UserRepository {
  /**
   * Finds a user by their Firebase UID.
   * Returns null if no user exists.
   */
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;

  /**
   * Finds a user by their unique ID.
   * Useful for authenticated requests.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Persists a new user.
   */
  create(user: User): Promise<User>;

  /**
   * Persists changes made to an existing user.
   */
  update(user: User): Promise<User>;

  /**
   * Checks whether a Firebase UID already exists.
   */
  existsByFirebaseUid(firebaseUid: string): Promise<boolean>;
}
