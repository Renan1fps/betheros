import { Payment, PaymentStatus } from '../../../domain/entities/payment.entity';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';

export class PaymentMapper {
  static toDomain(orm: PaymentOrmEntity): Payment {
    return new Payment({
      id: orm.id,
      subscriptionId: orm.subscription.id,
      gateway: orm.gateway,
      externalPaymentId: orm.externalPaymentId,
      amount: Number(orm.amount),
      currency: orm.currency,
      status: orm.status as PaymentStatus,
      paidAt: orm.paidAt,
      createdAt: orm.createdAt,
    });
  }

  static toOrm(domain: Payment): PaymentOrmEntity {
    const orm = new PaymentOrmEntity();
    orm.id = domain.id;
    orm.subscription = { id: domain.subscriptionId } as any;
    orm.gateway = domain.gateway;
    orm.externalPaymentId = domain.externalPaymentId;
    orm.amount = domain.amount;
    orm.currency = domain.currency;
    orm.status = domain.status;
    orm.paidAt = domain.paidAt;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
