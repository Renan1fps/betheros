import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';
import { UserAuthProviderOrmEntity } from './infrastructure/persistence/entities/user-auth-provider.orm-entity';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository.impl';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UserController } from './infrastructure/http/controllers/user.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserOrmEntity, UserAuthProviderOrmEntity])],
  controllers: [UserController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    CreateUserUseCase,
    GetUserUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
