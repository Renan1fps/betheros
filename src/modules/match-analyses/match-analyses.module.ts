import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MatchAnalysisOrmEntity } from './infrastructure/persistence/entities/match-analysis.orm-entity';
import { MatchAnalysisRepository } from './infrastructure/persistence/repositories/match-analysis.repository.impl';
import { MATCH_ANALYSIS_REPOSITORY } from './domain/repositories/match-analysis.repository';

@Module({
  imports: [MikroOrmModule.forFeature([MatchAnalysisOrmEntity])],
  providers: [
    { provide: MATCH_ANALYSIS_REPOSITORY, useClass: MatchAnalysisRepository },
  ],
  exports: [MATCH_ANALYSIS_REPOSITORY],
})
export class MatchAnalysesModule {}
