import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PaymentOrmEntity } from './infrastructure/persistence/entities/payment.orm-entity';
import { PaymentRepository } from './infrastructure/persistence/repositories/payment.repository.impl';
import { PAYMENT_REPOSITORY } from './domain/repositories/payment.repository';
import { CreateRecurringPaymentUseCase } from "@modules/payments/application/use-cases/create-recurring-payment.use-case";
import { SubscriptionsModule } from "@modules/subscriptions/subscriptions.module";

@Module({
  imports: [MikroOrmModule.forFeature([PaymentOrmEntity]), SubscriptionsModule],
  providers: [
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository } ,
    CreateRecurringPaymentUseCase
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
