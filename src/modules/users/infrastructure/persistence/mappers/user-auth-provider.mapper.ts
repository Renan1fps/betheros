import {
    UserAuthProviderOrmEntity
} from "@modules/users/infrastructure/persistence/entities/user-auth-provider.orm-entity";
import { UserAuthProvider } from "@modules/users/domain/entities/user-auth-provider.entity";
import { UserOrmEntity } from "@modules/users/infrastructure/persistence/entities/user.orm-entity";

export class UserAuthProviderMapper {
    static toDomain(orm: UserAuthProviderOrmEntity): UserAuthProvider {
        return new UserAuthProvider({
            id: orm.id,
            providerUserId: orm.providerUserId,
            provider: orm.provider,
            userId: orm.user.id,
            createdAt: orm.createdAt,
        });
    }

    static toOrm(domain: UserAuthProvider): UserAuthProviderOrmEntity {
        const orm = new UserAuthProviderOrmEntity();
        orm.id = domain.id;
        orm.user = <UserOrmEntity>{ id: domain.userId };
        orm.provider = domain.provider;
        orm.providerUserId = domain.providerUserId;
        orm.createdAt = domain.createdAt;
        return orm;
    }
}
