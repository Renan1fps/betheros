import { BaseEntity } from '@shared/domain/base.entity';

export interface MatchStatisticsSnapshotProps {
  id?: string;
  matchId: string;
  minute: number;
  possessionHome: number;
  possessionAway: number;
  shotsHome: number;
  shotsAway: number;
  shotsOnTargetHome: number;
  shotsOnTargetAway: number;
  cornersHome: number;
  cornersAway: number;
  foulsHome: number;
  foulsAway: number;
  yellowCardsHome: number;
  yellowCardsAway: number;
  redCardsHome: number;
  redCardsAway: number;
  createdAt?: Date;
}

export class MatchStatisticsSnapshot extends BaseEntity {
  readonly matchId: string;
  readonly minute: number;
  readonly possessionHome: number;
  readonly possessionAway: number;
  readonly shotsHome: number;
  readonly shotsAway: number;
  readonly shotsOnTargetHome: number;
  readonly shotsOnTargetAway: number;
  readonly cornersHome: number;
  readonly cornersAway: number;
  readonly foulsHome: number;
  readonly foulsAway: number;
  readonly yellowCardsHome: number;
  readonly yellowCardsAway: number;
  readonly redCardsHome: number;
  readonly redCardsAway: number;
  readonly createdAt: Date;

  constructor(props: MatchStatisticsSnapshotProps) {
    super(props.id);
    Object.assign(this, { ...props, createdAt: props.createdAt ?? new Date() });
  }

  static create(props: Omit<MatchStatisticsSnapshotProps, 'id' | 'createdAt'>): MatchStatisticsSnapshot {
    return new MatchStatisticsSnapshot(props);
  }
}
