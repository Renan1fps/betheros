import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { MatchOrmEntity } from '../../../../matches/infrastructure/persistence/entities/match.orm-entity';
import { MatchAnalysisOrmEntity } from '../../../../match-analyses/infrastructure/persistence/entities/match-analysis.orm-entity';

@Entity({ tableName: 'match_tips' })
export class MatchTipOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MatchOrmEntity, { fieldName: 'match_id' })
  match!: MatchOrmEntity;

  @ManyToOne(() => MatchAnalysisOrmEntity, { fieldName: 'analysis_id' })
  analysis!: MatchAnalysisOrmEntity;

  @Property()
  minute!: number;

  @Property({ fieldName: 'tip_type' })
  tipType!: string;

  @Property({ fieldName: 'suggested_team_id', nullable: true, type: 'uuid' })
  suggestedTeamId?: string;

  @Property({ type: 'decimal', precision: 5, scale: 4 })
  confidence!: number;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();
}
