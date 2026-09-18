import NotFoundError from "@/shared/errors/not-found.js";
import type { User } from "../../domain/entities/user.entity.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";

export class GetMyProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("USER_NOT_FOUND", "User not found.");
    }

    return user;
  }
}
