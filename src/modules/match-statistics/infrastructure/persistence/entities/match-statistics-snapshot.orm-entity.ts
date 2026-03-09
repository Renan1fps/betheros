import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infrastructure/database/base.orm-entity';
import { MatchOrmEntity } from '../../../../matches/infrastructure/persistence/entities/match.orm-entity';

@Entity({ tableName: 'match_statistics_snapshots' })
export class MatchStatisticsSnapshotOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MatchOrmEntity, { fieldName: 'match_id' })
  match!: MatchOrmEntity;

  @Property()
  minute!: number;

  @Property({ fieldName: 'possession_home', type: 'decimal', precision: 5, scale: 2 })
  possessionHome!: number;

  @Property({ fieldName: 'possession_away', type: 'decimal', precision: 5, scale: 2 })
  possessionAway!: number;

  @Property({ fieldName: 'shots_home' })
  shotsHome!: number;

  @Property({ fieldName: 'shots_away' })
  shotsAway!: number;

  @Property({ fieldName: 'shots_on_target_home' })
  shotsOnTargetHome!: number;

  @Property({ fieldName: 'shots_on_target_away' })
  shotsOnTargetAway!: number;

  @Property({ fieldName: 'corners_home' })
  cornersHome!: number;

  @Property({ fieldName: 'corners_away' })
  cornersAway!: number;

  @Property({ fieldName: 'fouls_home' })
  foulsHome!: number;

  @Property({ fieldName: 'fouls_away' })
  foulsAway!: number;

  @Property({ fieldName: 'yellow_cards_home' })
  yellowCardsHome!: number;

  @Property({ fieldName: 'yellow_cards_away' })
  yellowCardsAway!: number;

  @Property({ fieldName: 'red_cards_home' })
  redCardsHome!: number;

  @Property({ fieldName: 'red_cards_away' })
  redCardsAway!: number;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();
}
