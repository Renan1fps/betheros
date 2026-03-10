import { Module } from '@nestjs/common';
import { StripeWebhookUseCase } from './application/stripe-webhook.use-case';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { StripeController } from "@modules/stripe/controller/stripe.controller";
import { StripeService } from "@modules/stripe/services/stripe.service";

@Module({
    imports: [
        SubscriptionsModule,
    ],
    controllers: [StripeController],
    providers: [
        StripeService,
        StripeWebhookUseCase,
    ],
    exports: [StripeService],
})
export class StripeModule {}