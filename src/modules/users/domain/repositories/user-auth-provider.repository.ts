import { IRepository } from '@shared/domain/repository.interface';
import { UserAuthProvider } from '../entities/user-auth-provider.entity';

export interface IUserAuthProviderRepository extends IRepository<UserAuthProvider> {
  findByUserIdAndProvider(userId: string, provider: string): Promise<UserAuthProvider | null>;
  findAllByUserId(userId: string): Promise<UserAuthProvider[]>;
}

export const USER_AUTH_PROVIDER_REPOSITORY = Symbol('IUserAuthProviderRepository');
