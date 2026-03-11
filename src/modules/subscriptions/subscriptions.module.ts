import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SubscriptionOrmEntity } from './infrastructure/persistence/entities/subscription.orm-entity';
import { SubscriptionRepository } from './infrastructure/persistence/repositories/subscription.repository.impl';
import { SUBSCRIPTION_REPOSITORY } from './domain/repositories/subscription.repository';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription.use-case';
import {PaymentOrmEntity} from "@modules/payments/infrastructure/persistence/entities/payment.orm-entity";
import {PAYMENT_REPOSITORY} from "@modules/payments/domain/repositories/payment.repository";
import {PaymentRepository} from "@modules/payments/infrastructure/persistence/repositories/payment.repository.impl";

@Module({
  imports: [MikroOrmModule.forFeature([SubscriptionOrmEntity, PaymentOrmEntity])],
  providers: [
    { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionRepository },
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
    CreateSubscriptionUseCase,
  ],
  exports: [SUBSCRIPTION_REPOSITORY, CreateSubscriptionUseCase],
})
export class SubscriptionsModule {}
