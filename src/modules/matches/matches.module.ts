import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MatchOrmEntity } from './infrastructure/persistence/entities/match.orm-entity';
import { MatchRepository } from './infrastructure/persistence/repositories/match.repository.impl';
import { MATCH_REPOSITORY } from './domain/repositories/match.repository';
import { CreateMatchUseCase, GetMatchUseCase, ListMatchesUseCase } from './application/use-cases/match.use-cases';
import { MatchController } from './infrastructure/http/controllers/match.controller';

@Module({
  imports: [MikroOrmModule.forFeature([MatchOrmEntity])],
  controllers: [MatchController],
  providers: [
    { provide: MATCH_REPOSITORY, useClass: MatchRepository },
    CreateMatchUseCase,
    GetMatchUseCase,
    ListMatchesUseCase,
  ],
  exports: [MATCH_REPOSITORY],
})
export class MatchesModule {}
