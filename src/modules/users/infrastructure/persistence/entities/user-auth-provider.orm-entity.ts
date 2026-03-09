import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

@Entity({ tableName: 'user_auth_providers' })
export class UserAuthProviderOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => UserOrmEntity, { fieldName: 'user_id' })
  user!: UserOrmEntity;

  @Property()
  provider!: string;

  @Property({ fieldName: 'provider_user_id' })
  providerUserId!: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();
}
