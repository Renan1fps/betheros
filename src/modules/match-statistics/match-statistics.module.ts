import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MatchStatisticsSnapshotOrmEntity } from './infrastructure/persistence/entities/match-statistics-snapshot.orm-entity';
import { MatchStatisticsSnapshotRepository } from './infrastructure/persistence/repositories/match-statistics-snapshot.repository.impl';
import { MATCH_STATISTICS_SNAPSHOT_REPOSITORY } from './domain/repositories/match-statistics-snapshot.repository';

@Module({
  imports: [MikroOrmModule.forFeature([MatchStatisticsSnapshotOrmEntity])],
  providers: [
    { provide: MATCH_STATISTICS_SNAPSHOT_REPOSITORY, useClass: MatchStatisticsSnapshotRepository },
  ],
  exports: [MATCH_STATISTICS_SNAPSHOT_REPOSITORY],
})
export class MatchStatisticsModule {}
