import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { UserAuthProviderOrmEntity } from './user-auth-provider.orm-entity';
import { SubscriptionOrmEntity } from '../../../subscriptions/infrastructure/persistence/entities/subscription.orm-entity';

@Entity({ tableName: 'users' })
export class UserOrmEntity extends BaseOrmEntity {
  @Property({ unique: true })
  email!: string;

  @Property({ fieldName: 'password_hash' })
  passwordHash!: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => UserAuthProviderOrmEntity, (p) => p.user)
  authProviders = new Collection<UserAuthProviderOrmEntity>(this);

  @OneToMany(() => SubscriptionOrmEntity, (s) => s.user)
  subscriptions = new Collection<SubscriptionOrmEntity>(this);
}
