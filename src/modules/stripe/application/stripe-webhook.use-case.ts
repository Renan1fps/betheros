import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SUBSCRIPTION_REPOSITORY } from '../../subscriptions/domain/repositories/subscription.repository';
import { ISubscriptionRepository } from '../../subscriptions/domain/repositories/subscription.repository';
import { Subscription } from '../../subscriptions/domain/entities/subscription.entity';

@Injectable()
export class StripeWebhookUseCase {
    constructor(
        @Inject(SUBSCRIPTION_REPOSITORY)
        private readonly subscriptionRepository: ISubscriptionRepository,
    ) {}

    async execute(event: Stripe.Event): Promise<void> {
        switch (event.type) {

            case 'customer.subscription.created': {
                const sub = event.data.object as Stripe.Subscription;
                await this.subscriptionRepository.save(
                    Subscription.create({
                        userId: sub.metadata.userId,
                        status: 'active',
                        plan: 'pro',
                        gateway: 'stripe',
                        externalSubscriptionId: sub.id,
                        startedAt: new Date(sub.start_date * 1000),
                        expiresAt: new Date(sub.next_pending_invoice_item_invoice! * 1000),
                    }),
                );
                break;
            }

            case 'customer.subscription.updated': {
                const sub = event.data.object as Stripe.Subscription;
                const existing = await this.subscriptionRepository
                    .findByExternalSubscriptionId(sub.id);
                if (existing) {
                    await this.subscriptionRepository.update(
                        existing.updateFromStripe({
                            status: sub.status === 'active' ? 'active' : 'inactive',
                            expiresAt: new Date(sub.next_pending_invoice_item_invoice! * 1000),
                        }),
                    );
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const sub = event.data.object as Stripe.Subscription;
                const existing = await this.subscriptionRepository
                    .findByExternalSubscriptionId(sub.id);
                if (existing) {
                    await this.subscriptionRepository.update(existing.cancel());
                }
                break;
            }
        }
    }
}