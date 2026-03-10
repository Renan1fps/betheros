import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2026-02-25.clover',
        });
    }

    async createCheckoutSession(userId: string, userEmail: string): Promise<string> {
        const prices = await this.stripe.prices.list({
            lookup_keys: [process.env.STRIPE_PRICE_LOOKUP_KEY!],
            expand: ['data.product'],
        });

        const session = await this.stripe.checkout.sessions.create({
            customer_email: userEmail,
            billing_address_collection: 'auto',
            line_items: [{ price: prices.data[0].id, quantity: 1 }],
            mode: 'subscription',
            subscription_data: {
                metadata: { userId },
            },
            success_url: `${process.env.APP_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.APP_URL}/stripe/cancel`,
        });

        return session.url!;
    }

    async createPortalSession(stripeCustomerId: string): Promise<string> {
        const session = await this.stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: process.env.APP_URL!,
        });
        return session.url;
    }

    constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
        return this.stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    }
}