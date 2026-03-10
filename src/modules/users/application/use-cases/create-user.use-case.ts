import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserAuthProvider } from "@modules/users/domain/entities/user-auth-provider.entity";
import {
    IUserAuthProviderRepository,
    USER_AUTH_PROVIDER_REPOSITORY
} from "@modules/users/domain/repositories/user-auth-provider.repository";
import { EntityManager } from "@mikro-orm/postgresql";

export interface CreateUserInput {
    email: string;
    password: string;
    provider: string;
    providerUserId?: string;
}

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(USER_AUTH_PROVIDER_REPOSITORY)
        private readonly userAuthProviderRepository: IUserAuthProviderRepository,
        private readonly em: EntityManager,
    ) {}

    async execute(input: CreateUserInput): Promise<User> {
        const existing = await this.userRepository.findByEmail(input.email);
        if (existing) {
            throw new ConflictException(`User with email ${input.email} already exists`);
        }

        return this.em.transactional(async () => {
            const passwordHash = await bcrypt.hash(input.password, 10);
            const user = User.create({ email: input.email, passwordHash });
            const savedUser = await this.userRepository.save(user);
            const authProvider = UserAuthProvider.create({
                provider: input.provider,
                userId: savedUser.id,
                providerUserId: input.provider !== 'betheros' ? input.providerUserId! : savedUser.id,
            });
            await this.userAuthProviderRepository.save(authProvider);

            return savedUser;
        });
    }
}
