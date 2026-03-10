import { IRepository } from '@shared/domain/repository.interface';
import { Subscription } from '../entities/subscription.entity';

export interface ISubscriptionRepository extends IRepository<Subscription> {
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserId(userId: string): Promise<Subscription | null>;
  findByExternalSubscriptionId(id: string): Promise<Subscription | null>;
}

export const SUBSCRIPTION_REPOSITORY = Symbol('ISubscriptionRepository');
