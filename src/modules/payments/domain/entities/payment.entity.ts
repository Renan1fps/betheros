import { BaseEntity } from '@shared/domain/base.entity';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentProps {
  id?: string;
  subscriptionId?: string;
  gateway: string;
  externalPaymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date;
  createdAt?: Date;
}

export class Payment extends BaseEntity {
  readonly subscriptionId?: string;
  readonly gateway: string;
  readonly externalPaymentId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly paidAt?: Date;
  readonly createdAt: Date;

  constructor(props: PaymentProps) {
    super(props.id);
    this.subscriptionId = props.subscriptionId;
    this.gateway = props.gateway;
    this.externalPaymentId = props.externalPaymentId;
    this.amount = props.amount;
    this.currency = props.currency;
    this.status = props.status;
    this.paidAt = props.paidAt;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: Omit<PaymentProps, 'id' | 'createdAt'>): Payment {
    return new Payment(props);
  }
}
