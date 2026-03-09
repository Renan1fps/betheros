import { IRepository } from '@shared/domain/repository.interface';
import { MatchTip } from '../entities/match-tip.entity';

export interface IMatchTipRepository extends IRepository<MatchTip> {
  findByMatchId(matchId: string): Promise<MatchTip[]>;
  findByAnalysisId(analysisId: string): Promise<MatchTip[]>;
}

export const MATCH_TIP_REPOSITORY = Symbol('IMatchTipRepository');
