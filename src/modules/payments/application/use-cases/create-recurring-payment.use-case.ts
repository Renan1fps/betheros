import { Inject, Injectable } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { IPaymentRepository, PAYMENT_REPOSITORY } from '../../domain/repositories/payment.repository';
import { ISubscriptionRepository, SUBSCRIPTION_REPOSITORY } from '../../../subscriptions/domain/repositories/subscription.repository';

export interface CreateRecurringPaymentInput {
    stripeSubscriptionId: string;
    userId: string;
    amountPaid: number;
    currency: string;
    externalPaymentId: string;
}

@Injectable()
export class CreateRecurringPaymentUseCase {
    constructor(
        @Inject(PAYMENT_REPOSITORY)
        private readonly paymentRepository: IPaymentRepository,
        @Inject(SUBSCRIPTION_REPOSITORY)
        private readonly subscriptionRepository: ISubscriptionRepository,
    ) {}

    async execute(input: CreateRecurringPaymentInput): Promise<void> {
        const subscription = await this.subscriptionRepository
            .findByProviderSubscriptionId(input.stripeSubscriptionId);

        if (!subscription) return;

        const firstPayment = await this.paymentRepository
            .findBySubscriptionId(subscription.id);

        if (!firstPayment?.subscriptionId) return;

        await this.paymentRepository.save(
            Payment.create({
                status: 'completed',
                gateway: 'stripe',
                subscriptionId: firstPayment.subscriptionId,
                amount: input.amountPaid / 100,
                currency: input.currency.toUpperCase(),
                externalPaymentId: input.externalPaymentId,
                paidAt: new Date(),
            }),
        );
    }
}