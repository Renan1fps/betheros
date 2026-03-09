import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { MatchOrmEntity } from '../../../../matches/infrastructure/persistence/entities/match.orm-entity';
import { MatchTipOrmEntity } from '../../../../match-tips/infrastructure/persistence/entities/match-tip.orm-entity';

@Entity({ tableName: 'match_analyses' })
export class MatchAnalysisOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MatchOrmEntity, { fieldName: 'match_id' })
  match!: MatchOrmEntity;

  @Property()
  minute!: number;

  @Property({ fieldName: 'model_version' })
  modelVersion!: string;

  @Property({ fieldName: 'home_win_probability', type: 'decimal', precision: 5, scale: 4 })
  homeWinProbability!: number;

  @Property({ fieldName: 'draw_probability', type: 'decimal', precision: 5, scale: 4 })
  drawProbability!: number;

  @Property({ fieldName: 'away_win_probability', type: 'decimal', precision: 5, scale: 4 })
  awayWinProbability!: number;

  @Property({ fieldName: 'first_half_home_win_probability', type: 'decimal', precision: 5, scale: 4 })
  firstHalfHomeWinProbability!: number;

  @Property({ fieldName: 'first_half_draw_probability', type: 'decimal', precision: 5, scale: 4 })
  firstHalfDrawProbability!: number;

  @Property({ fieldName: 'first_half_away_win_probability', type: 'decimal', precision: 5, scale: 4 })
  firstHalfAwayWinProbability!: number;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @OneToMany(() => MatchTipOrmEntity, (t) => t.analysis)
  tips = new Collection<MatchTipOrmEntity>(this);
}
