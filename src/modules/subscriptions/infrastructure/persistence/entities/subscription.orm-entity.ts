import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { UserOrmEntity } from '@modules/users/infrastructure/persistence/entities/user.orm-entity';
import { PaymentOrmEntity } from '@modules/payments/infrastructure/persistence/entities/payment.orm-entity';

@Entity({ tableName: 'subscriptions' })
export class SubscriptionOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => UserOrmEntity, { fieldName: 'user_id' })
  user!: UserOrmEntity;

  @Property()
  status!: string;

  @Property({ fieldName: 'provider_subscription_id' })
  providerSubscriptionId!: string;

  @Property()
  plan!: string;

  @Property({ fieldName: 'started_at' })
  startedAt!: Date;

  @Property({ fieldName: 'expires_at' })
  expiresAt!: Date;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @OneToMany(() => PaymentOrmEntity, (p) => p.subscription)
  payments = new Collection<PaymentOrmEntity>(this);
}
