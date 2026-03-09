import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PaymentOrmEntity } from './infrastructure/persistence/entities/payment.orm-entity';
import { PaymentRepository } from './infrastructure/persistence/repositories/payment.repository.impl';
import { PAYMENT_REPOSITORY } from './domain/repositories/payment.repository';

@Module({
  imports: [MikroOrmModule.forFeature([PaymentOrmEntity])],
  providers: [
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
