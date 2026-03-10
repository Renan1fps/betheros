import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IUserAuthProviderRepository } from "@modules/users/domain/repositories/user-auth-provider.repository";
import { UserAuthProvider } from "@modules/users/domain/entities/user-auth-provider.entity";
import { UserAuthProviderMapper } from "@modules/users/infrastructure/persistence/mappers/user-auth-provider.mapper";

@Injectable()
export class UserAuthProviderRepository implements IUserAuthProviderRepository {
    constructor(private readonly em: EntityManager) {
    }

    findByUserIdAndProvider(userId: string, provider: string): Promise<UserAuthProvider | null> {
        throw new Error("Method not implemented.");
    }

    findAllByUserId(userId: string): Promise<UserAuthProvider[]> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<UserAuthProvider | null> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<UserAuthProvider[]> {
        throw new Error("Method not implemented.");
    }

    async save(entity: UserAuthProvider): Promise<UserAuthProvider> {
        const orm = UserAuthProviderMapper.toOrm(entity);
        await this.em.persist(orm).flush();
        return UserAuthProviderMapper.toDomain(orm);
    }

    update(entity: UserAuthProvider): Promise<UserAuthProvider> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }




}
