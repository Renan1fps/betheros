import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SubscriptionOrmEntity } from './infrastructure/persistence/entities/subscription.orm-entity';
import { SubscriptionRepository } from './infrastructure/persistence/repositories/subscription.repository.impl';
import { SUBSCRIPTION_REPOSITORY } from './domain/repositories/subscription.repository';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription.use-case';

@Module({
  imports: [MikroOrmModule.forFeature([SubscriptionOrmEntity])],
  providers: [
    { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionRepository },
    CreateSubscriptionUseCase,
  ],
  exports: [SUBSCRIPTION_REPOSITORY, CreateSubscriptionUseCase],
})
export class SubscriptionsModule {}
