import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Subscription, SubscriptionPlan } from '../../domain/entities/subscription.entity';
import { ISubscriptionRepository, SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription.repository';

export interface CreateSubscriptionInput {
  userId: string;
  plan: SubscriptionPlan;
  startedAt: Date;
  expiresAt: Date;
}

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(input: CreateSubscriptionInput): Promise<Subscription> {
    const active = await this.subscriptionRepository.findActiveByUserId(input.userId);
    if (active) {
      throw new ConflictException(`User already has an active subscription`);
    }

    const subscription = Subscription.create({
      userId: input.userId,
      status: 'active',
      plan: input.plan,
      startedAt: input.startedAt,
      expiresAt: input.expiresAt,
      externalSubscriptionId: '',
      gateway: 'teste'
    });

    return this.subscriptionRepository.save(subscription);
  }
}
