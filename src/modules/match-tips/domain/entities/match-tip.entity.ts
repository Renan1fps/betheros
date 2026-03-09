import { BaseEntity } from '@shared/domain/base.entity';

export interface MatchTipProps {
  id?: string;
  matchId: string;
  analysisId: string;
  minute: number;
  tipType: string;
  suggestedTeamId?: string;
  confidence: number;
  createdAt?: Date;
}

export class MatchTip extends BaseEntity {
  readonly matchId: string;
  readonly analysisId: string;
  readonly minute: number;
  readonly tipType: string;
  readonly suggestedTeamId?: string;
  readonly confidence: number;
  readonly createdAt: Date;

  constructor(props: MatchTipProps) {
    super(props.id);
    Object.assign(this, { ...props, createdAt: props.createdAt ?? new Date() });
  }

  static create(props: Omit<MatchTipProps, 'id' | 'createdAt'>): MatchTip {
    return new MatchTip(props);
  }
}
