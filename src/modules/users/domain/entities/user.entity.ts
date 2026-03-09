import { BaseEntity } from '@shared/domain/base.entity';

export interface UserProps {
  id?: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends BaseEntity {
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    super(props.id);
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  update(partial: Partial<Pick<UserProps, 'email' | 'passwordHash'>>): User {
    return new User({
      id: this.id,
      email: partial.email ?? this.email,
      passwordHash: partial.passwordHash ?? this.passwordHash,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    return new User(props);
  }
}
