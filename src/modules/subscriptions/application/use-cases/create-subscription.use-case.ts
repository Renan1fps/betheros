import { Inject, Injectable } from '@nestjs/common';
import { Subscription, SubscriptionPlan } from '../../domain/entities/subscription.entity';
import { ISubscriptionRepository, SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription.repository';
import { IPaymentRepository, PAYMENT_REPOSITORY } from "@modules/payments/domain/repositories/payment.repository";
import { Payment } from "@modules/payments/domain/entities/payment.entity";

export interface CreateSubscriptionInput {
  userId: string;
  plan: SubscriptionPlan;
  startedAt: Date;
  expiresAt?: Date;
  gateway: string;
  externalPaymentId: string;
  externalSubscriptionId: string;
}

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

    async execute(input: CreateSubscriptionInput): Promise<Subscription> {
        let subscription = await this.subscriptionRepository.findActiveByUserId(input.userId);

        if (!subscription) {
            const expiresAt = input.expiresAt ?? (() => {
                const d = new Date(input.startedAt);
                d.setMonth(d.getMonth() + 1);
                return d;
            })();

            subscription = await this.subscriptionRepository.save(
                Subscription.create({
                    userId: input.userId,
                    status: 'active',
                    plan: 'pro',
                    startedAt: input.startedAt,
                    expiresAt,
                    providerSubscriptionId: input.externalSubscriptionId,
                }),
            );
        }

        const payment = Payment.create({
            status: 'completed',
            gateway: 'stripe',
            subscriptionId: subscription.id,
            amount: 25,
            currency: 'BRL',
            externalPaymentId: input.externalPaymentId,
            paidAt: new Date(),
        });

        await this.paymentRepository.save(payment);
        return subscription;
    }
}
