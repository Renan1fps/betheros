import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { MatchStatisticsSnapshotOrmEntity } from '../../../../match-statistics/infrastructure/persistence/entities/match-statistics-snapshot.orm-entity';
import { MatchAnalysisOrmEntity } from '../../../../match-analyses/infrastructure/persistence/entities/match-analysis.orm-entity';

@Entity({ tableName: 'matches' })
export class MatchOrmEntity extends BaseOrmEntity {
  @Property({ fieldName: 'external_id', nullable: true })
  externalId?: string;

  @Property({ fieldName: 'competition_id', type: 'uuid' })
  competitionId!: string;

  @Property({ fieldName: 'home_team_id', type: 'uuid' })
  homeTeamId!: string;

  @Property({ fieldName: 'away_team_id', type: 'uuid' })
  awayTeamId!: string;

  @Property({ fieldName: 'match_date' })
  matchDate!: Date;

  @Property()
  status!: string;

  @Property({ fieldName: 'home_score', nullable: true })
  homeScore?: number;

  @Property({ fieldName: 'away_score', nullable: true })
  awayScore?: number;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => MatchStatisticsSnapshotOrmEntity, (s) => s.match)
  statisticsSnapshots = new Collection<MatchStatisticsSnapshotOrmEntity>(this);

  @OneToMany(() => MatchAnalysisOrmEntity, (a) => a.match)
  analyses = new Collection<MatchAnalysisOrmEntity>(this);
}
