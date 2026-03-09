import { BaseEntity } from '@shared/domain/base.entity';

export interface UserAuthProviderProps {
  id?: string;
  userId: string;
  provider: string;
  providerUserId: string;
  createdAt?: Date;
}

export class UserAuthProvider extends BaseEntity {
  readonly userId: string;
  readonly provider: string;
  readonly providerUserId: string;
  readonly createdAt: Date;

  constructor(props: UserAuthProviderProps) {
    super(props.id);
    this.userId = props.userId;
    this.provider = props.provider;
    this.providerUserId = props.providerUserId;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: Omit<UserAuthProviderProps, 'id' | 'createdAt'>): UserAuthProvider {
    return new UserAuthProvider(props);
  }
}
