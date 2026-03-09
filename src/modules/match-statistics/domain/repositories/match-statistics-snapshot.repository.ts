import { IRepository } from '@shared/domain/repository.interface';
import { MatchStatisticsSnapshot } from '../entities/match-statistics-snapshot.entity';

export interface IMatchStatisticsSnapshotRepository extends IRepository<MatchStatisticsSnapshot> {
  findByMatchId(matchId: string): Promise<MatchStatisticsSnapshot[]>;
  findByMatchIdAndMinute(matchId: string, minute: number): Promise<MatchStatisticsSnapshot | null>;
}

export const MATCH_STATISTICS_SNAPSHOT_REPOSITORY = Symbol('IMatchStatisticsSnapshotRepository');
