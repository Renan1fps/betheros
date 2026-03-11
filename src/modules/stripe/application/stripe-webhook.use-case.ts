import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import {
    ISubscriptionRepository,
    SUBSCRIPTION_REPOSITORY
} from '../../subscriptions/domain/repositories/subscription.repository';
import { CreateSubscriptionUseCase } from "@modules/subscriptions/application/use-cases/create-subscription.use-case";
import { IPaymentRepository, PAYMENT_REPOSITORY } from "@modules/payments/domain/repositories/payment.repository";
import { Payment } from "@modules/payments/domain/entities/payment.entity";
import {StripeService} from "@modules/stripe/services/stripe.service";

interface StripeInvoiceExtended extends Stripe.InvoicePayment {
    subscription?: string;
    billing_reason: string;
    amount_paid: number;
    parent: {
        subscription_details?: {
            metadata?: Record<string, string>;
        };
    };
}

@Injectable()
export class StripeWebhookUseCase {
    constructor(
        @Inject(SUBSCRIPTION_REPOSITORY)
        private readonly subscriptionRepository: ISubscriptionRepository,
        @Inject(PAYMENT_REPOSITORY)
        private readonly paymentRepository: IPaymentRepository,
        private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
        private readonly stripeService: StripeService,
    ) {}

    async execute(event: Stripe.Event): Promise<void> {
        switch (event.type) {

            case 'customer.subscription.created': {
                const sub = event.data.object as Stripe.Subscription;
                const invoiceId = await this.stripeService.getInvoiceBySubscriptionId(sub.id);
                await this.createSubscriptionUseCase.execute({
                    userId: sub.metadata.userId,
                    gateway: 'stripe',
                    startedAt:  new Date(sub.start_date * 1000),
                    externalSubscriptionId: sub.id,
                    plan: 'pro',
                    externalPaymentId: invoiceId,
                });
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as unknown as StripeInvoiceExtended;
                if (invoice.billing_reason === 'subscription_create') break;
                const stripeSubscriptionId = invoice.subscription;
                const userId = invoice.parent?.subscription_details?.metadata?.userId;
                if (!stripeSubscriptionId || !userId) break;
                const subscription = await this.subscriptionRepository.findByProviderSubscriptionId(stripeSubscriptionId);
                if (!subscription) break;
                const firstPayment = await this.paymentRepository.findBySubscriptionId(subscription.id);
                if (!firstPayment || !firstPayment.subscriptionId) break;
                await this.paymentRepository.save(
                    Payment.create({
                        status: 'completed',
                        gateway: 'stripe',
                        subscriptionId: firstPayment.subscriptionId,
                        amount: invoice.amount_paid / 100,
                        currency: invoice.currency.toUpperCase(),
                        externalPaymentId: invoice.id,
                        paidAt: new Date(),
                    }),
                );
                break;
            }

            case 'customer.subscription.updated': {
                const sub = event.data.object as Stripe.Subscription;
                const existing = await this.subscriptionRepository
                    .findByProviderSubscriptionId(sub.id);
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
                    .findByProviderSubscriptionId(sub.id);
                if (existing) {
                    await this.subscriptionRepository.update(existing.cancel());
                }
                break;
            }
        }
    }
}