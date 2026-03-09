import { IRepository } from '@shared/domain/repository.interface';
import { MatchAnalysis } from '../entities/match-analysis.entity';

export interface IMatchAnalysisRepository extends IRepository<MatchAnalysis> {
  findByMatchId(matchId: string): Promise<MatchAnalysis[]>;
  findLatestByMatchId(matchId: string): Promise<MatchAnalysis | null>;
}

export const MATCH_ANALYSIS_REPOSITORY = Symbol('IMatchAnalysisRepository');
