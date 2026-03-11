import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository';
import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { PaymentMapper } from '../mappers/payment.mapper';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<Payment | null> {
    const orm = await this.em.findOne(PaymentOrmEntity, { id }, { populate: ['subscription'] });
    return orm ? PaymentMapper.toDomain(orm) : null;
  }

  async findBySubscriptionId(subscriptionId: string):  Promise<Payment | null> {
    const orm = await this.em.findOne(PaymentOrmEntity, { subscription: { id: subscriptionId } }, { populate: ['subscription'] });
    return orm ? PaymentMapper.toDomain(orm) : null;
  }

  async findByExternalPaymentId(externalPaymentId: string): Promise<Payment | null> {
    const orm = await this.em.findOne(PaymentOrmEntity, { externalPaymentId }, { populate: ['subscription'] });
    return orm ? PaymentMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Payment[]> {
    const orms = await this.em.findAll(PaymentOrmEntity, { populate: ['subscription'] });
    return orms.map(PaymentMapper.toDomain);
  }

  async save(payment: Payment): Promise<Payment> {
    const orm = PaymentMapper.toOrm(payment);
    await this.em.persist(orm).flush();
    return PaymentMapper.toDomain(orm);
  }

  async update(payment: Payment): Promise<Payment> {
    const existing = await this.em.findOneOrFail(PaymentOrmEntity, { id: payment.id });
    existing.status = payment.status;
    existing.paidAt = payment.paidAt;
    await this.em.flush();
    return PaymentMapper.toDomain(existing);
  }

  async delete(id: string): Promise<void> {
    const orm = await this.em.findOneOrFail(PaymentOrmEntity, { id });
    await this.em.remove(orm).flush();
  }
}
