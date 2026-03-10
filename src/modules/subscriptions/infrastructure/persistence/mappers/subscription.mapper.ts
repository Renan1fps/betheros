import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../../../domain/entities/subscription.entity';
import { SubscriptionOrmEntity } from '../entities/subscription.orm-entity';

export class SubscriptionMapper {
  static toDomain(orm: SubscriptionOrmEntity): Subscription {
    return new Subscription({
      id: orm.id,
      userId: orm.user.id,
      status: orm.status as SubscriptionStatus,
      plan: orm.plan as SubscriptionPlan,
      startedAt: orm.startedAt,
      expiresAt: orm.expiresAt,
      createdAt: orm.createdAt,
      externalSubscriptionId: orm.externalSubscriptionId,
      gateway: orm.gateway,
    });
  }

  static toOrm(domain: Subscription): SubscriptionOrmEntity {
    const orm = new SubscriptionOrmEntity();
    orm.id = domain.id;
    orm.user = { id: domain.userId } as any;
    orm.status = domain.status;
    orm.plan = domain.plan;
    orm.startedAt = domain.startedAt;
    orm.expiresAt = domain.expiresAt;
    orm.createdAt = domain.createdAt;
    orm.externalSubscriptionId = domain.externalSubscriptionId;
    orm.gateway = domain.gateway;
    return orm;
  }
}
