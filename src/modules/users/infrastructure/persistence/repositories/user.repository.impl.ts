import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<User | null> {
    const orm = await this.em.findOne(UserOrmEntity, { id });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.em.findOne(UserOrmEntity, { email });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<User[]> {
    const orms = await this.em.findAll(UserOrmEntity);
    return orms.map(UserMapper.toDomain);
  }

  async save(user: User): Promise<User> {
    const orm = UserMapper.toOrm(user);
    await this.em.persist(orm).flush();
    return UserMapper.toDomain(orm);
  }

  async update(user: User): Promise<User> {
    const existing = await this.em.findOneOrFail(UserOrmEntity, { id: user.id });
    existing.email = user.email;
    existing.passwordHash = user.passwordHash;
    existing.updatedAt = new Date();
    await this.em.flush();
    return UserMapper.toDomain(existing);
  }

  async delete(id: string): Promise<void> {
    const orm = await this.em.findOneOrFail(UserOrmEntity, { id });
    await this.em.removeAndFlush(orm);
  }
}
