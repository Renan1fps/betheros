import { BaseEntity } from '@shared/domain/base.entity';

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

export interface SubscriptionProps {
  id?: string;
  userId: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  startedAt: Date;
  expiresAt: Date;
  createdAt?: Date;
}

export class Subscription extends BaseEntity {
  readonly userId: string;
  readonly status: SubscriptionStatus;
  readonly plan: SubscriptionPlan;
  readonly startedAt: Date;
  readonly expiresAt: Date;
  readonly createdAt: Date;

  constructor(props: SubscriptionProps) {
    super(props.id);
    this.userId = props.userId;
    this.status = props.status;
    this.plan = props.plan;
    this.startedAt = props.startedAt;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt ?? new Date();
  }

  isActive(): boolean {
    return this.status === 'active' && this.expiresAt > new Date();
  }

  cancel(): Subscription {
    return new Subscription({ ...this.toProps(), status: 'cancelled' });
  }

  private toProps(): SubscriptionProps {
    return {
      id: this.id,
      userId: this.userId,
      status: this.status,
      plan: this.plan,
      startedAt: this.startedAt,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
    };
  }

  static create(props: Omit<SubscriptionProps, 'id' | 'createdAt'>): Subscription {
    return new Subscription(props);
  }
}
