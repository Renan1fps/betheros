import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ISubscriptionRepository } from '../../../domain/repositories/subscription.repository';
import { Subscription } from '../../../domain/entities/subscription.entity';
import { SubscriptionOrmEntity } from '../entities/subscription.orm-entity';
import { SubscriptionMapper } from '../mappers/subscription.mapper';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly em: EntityManager) {}

  async findByProviderSubscriptionId(id: string): Promise<Subscription | null> {
    const orm = await this.em.findOne(SubscriptionOrmEntity, { providerSubscriptionId: id }, { populate: ['user'] });
    return orm ? SubscriptionMapper.toDomain(orm) : null;
  }

  async findById(id: string): Promise<Subscription | null> {
    const orm = await this.em.findOne(SubscriptionOrmEntity, { id }, { populate: ['user'] });
    return orm ? SubscriptionMapper.toDomain(orm) : null;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const orms = await this.em.find(SubscriptionOrmEntity, { user: { id: userId } }, { populate: ['user'] });
    return orms.map(SubscriptionMapper.toDomain);
  }

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    const orm = await this.em.findOne(
      SubscriptionOrmEntity,
      { user: { id: userId }, status: 'active' },
      { populate: ['user'] },
    );
    return orm ? SubscriptionMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Subscription[]> {
    const orms = await this.em.findAll(SubscriptionOrmEntity, { populate: ['user'] });
    return orms.map(SubscriptionMapper.toDomain);
  }

  async save(subscription: Subscription): Promise<Subscription> {
    const orm = SubscriptionMapper.toOrm(subscription);
    await this.em.persistAndFlush(orm);
    return SubscriptionMapper.toDomain(orm);
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const existing = await this.em.findOneOrFail(SubscriptionOrmEntity, { id: subscription.id });
    existing.status = subscription.status;
    existing.plan = subscription.plan;
    existing.expiresAt = subscription.expiresAt;
    await this.em.flush();
    return SubscriptionMapper.toDomain(existing);
  }

  async delete(id: string): Promise<void> {
    const orm = await this.em.findOneOrFail(SubscriptionOrmEntity, { id });
    await this.em.removeAndFlush(orm);
  }
}
