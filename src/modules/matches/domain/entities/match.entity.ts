import { BaseEntity } from '@shared/domain/base.entity';

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled' | 'postponed';

export interface MatchProps {
  id?: string;
  externalId?: string;
  competitionId: string;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: Date;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Match extends BaseEntity {
  readonly externalId?: string;
  readonly competitionId: string;
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly matchDate: Date;
  readonly status: MatchStatus;
  readonly homeScore?: number;
  readonly awayScore?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: MatchProps) {
    super(props.id);
    this.externalId = props.externalId;
    this.competitionId = props.competitionId;
    this.homeTeamId = props.homeTeamId;
    this.awayTeamId = props.awayTeamId;
    this.matchDate = props.matchDate;
    this.status = props.status;
    this.homeScore = props.homeScore;
    this.awayScore = props.awayScore;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  updateScore(homeScore: number, awayScore: number): Match {
    return new Match({ ...this.toProps(), homeScore, awayScore, updatedAt: new Date() });
  }

  updateStatus(status: MatchStatus): Match {
    return new Match({ ...this.toProps(), status, updatedAt: new Date() });
  }

  private toProps(): MatchProps {
    return {
      id: this.id,
      externalId: this.externalId,
      competitionId: this.competitionId,
      homeTeamId: this.homeTeamId,
      awayTeamId: this.awayTeamId,
      matchDate: this.matchDate,
      status: this.status,
      homeScore: this.homeScore,
      awayScore: this.awayScore,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static create(props: Omit<MatchProps, 'id' | 'createdAt' | 'updatedAt'>): Match {
    return new Match(props);
  }
}
