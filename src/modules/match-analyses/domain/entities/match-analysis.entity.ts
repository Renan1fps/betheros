import { BaseEntity } from '@shared/domain/base.entity';

export interface MatchAnalysisProps {
  id?: string;
  matchId: string;
  minute: number;
  modelVersion: string;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  firstHalfHomeWinProbability: number;
  firstHalfDrawProbability: number;
  firstHalfAwayWinProbability: number;
  createdAt?: Date;
}

export class MatchAnalysis extends BaseEntity {
  readonly matchId: string;
  readonly minute: number;
  readonly modelVersion: string;
  readonly homeWinProbability: number;
  readonly drawProbability: number;
  readonly awayWinProbability: number;
  readonly firstHalfHomeWinProbability: number;
  readonly firstHalfDrawProbability: number;
  readonly firstHalfAwayWinProbability: number;
  readonly createdAt: Date;

  constructor(props: MatchAnalysisProps) {
    super(props.id);
    Object.assign(this, { ...props, createdAt: props.createdAt ?? new Date() });
  }

  static create(props: Omit<MatchAnalysisProps, 'id' | 'createdAt'>): MatchAnalysis {
    return new MatchAnalysis(props);
  }
}
