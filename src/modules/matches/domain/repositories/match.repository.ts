import { IRepository } from '@shared/domain/repository.interface';
import { Match, MatchStatus } from '../entities/match.entity';

export interface FindMatchesFilters {
  competitionId?: string;
  homeTeamId?: string;
  awayTeamId?: string;
  status?: MatchStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IMatchRepository extends IRepository<Match> {
  findByExternalId(externalId: string): Promise<Match | null>;
  findByFilters(filters: FindMatchesFilters): Promise<Match[]>;
}

export const MATCH_REPOSITORY = Symbol('IMatchRepository');
