import { IRepository } from '@shared/domain/repository.interface';
import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository extends IRepository<Payment> {
  findBySubscriptionId(subscriptionId: string): Promise<Payment | null>;
  findByExternalPaymentId(externalPaymentId: string): Promise<Payment | null>;
}

export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository');
