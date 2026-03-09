import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { SubscriptionOrmEntity } from '@modules/subscriptions/infrastructure/persistence/entities/subscription.orm-entity';

@Entity({ tableName: 'payments' })
export class PaymentOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => SubscriptionOrmEntity, { fieldName: 'subscription_id' })
  subscription!: SubscriptionOrmEntity;

  @Property()
  gateway!: string;

  @Property({ fieldName: 'external_payment_id' })
  externalPaymentId!: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Property()
  currency!: string;

  @Property()
  status!: string;

  @Property({ fieldName: 'paid_at', nullable: true })
  paidAt?: Date;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();
}
