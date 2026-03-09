import { MatchAnalysis } from '../../../domain/entities/match-analysis.entity';
import { MatchAnalysisOrmEntity } from '../entities/match-analysis.orm-entity';

export class MatchAnalysisMapper {
  static toDomain(orm: MatchAnalysisOrmEntity): MatchAnalysis {
    return new MatchAnalysis({
      id: orm.id,
      matchId: orm.match.id,
      minute: orm.minute,
      modelVersion: orm.modelVersion,
      homeWinProbability: Number(orm.homeWinProbability),
      drawProbability: Number(orm.drawProbability),
      awayWinProbability: Number(orm.awayWinProbability),
      firstHalfHomeWinProbability: Number(orm.firstHalfHomeWinProbability),
      firstHalfDrawProbability: Number(orm.firstHalfDrawProbability),
      firstHalfAwayWinProbability: Number(orm.firstHalfAwayWinProbability),
      createdAt: orm.createdAt,
    });
  }

  static toOrm(domain: MatchAnalysis): MatchAnalysisOrmEntity {
    const orm = new MatchAnalysisOrmEntity();
    orm.id = domain.id;
    orm.match = { id: domain.matchId } as any;
    orm.minute = domain.minute;
    orm.modelVersion = domain.modelVersion;
    orm.homeWinProbability = domain.homeWinProbability;
    orm.drawProbability = domain.drawProbability;
    orm.awayWinProbability = domain.awayWinProbability;
    orm.firstHalfHomeWinProbability = domain.firstHalfHomeWinProbability;
    orm.firstHalfDrawProbability = domain.firstHalfDrawProbability;
    orm.firstHalfAwayWinProbability = domain.firstHalfAwayWinProbability;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
