import type {
  User as PrismaUser,
  Prisma,
  PrismaClient,
} from "@/generated/client/client.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { User } from "../../domain/entities/user.entity.js";
import { UserMapper } from "./user.mapper.js";

type PrismaExecuter = PrismaClient | Prisma.TransactionClient;

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  private toDomainOrNull(raw: PrismaUser | null): User | null {
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { firebaseUid } });

    return this.toDomainOrNull(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return this.toDomainOrNull(user);
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(created);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(updated);
  }

  async existsByFirebaseUid(firebaseUid: string): Promise<boolean> {
    const exists = await this.prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });

    return exists !== null;
  }
}
