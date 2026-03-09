import { Match, MatchStatus } from '../../../domain/entities/match.entity';
import { MatchOrmEntity } from '../entities/match.orm-entity';

export class MatchMapper {
  static toDomain(orm: MatchOrmEntity): Match {
    return new Match({
      id: orm.id,
      externalId: orm.externalId,
      competitionId: orm.competitionId,
      homeTeamId: orm.homeTeamId,
      awayTeamId: orm.awayTeamId,
      matchDate: orm.matchDate,
      status: orm.status as MatchStatus,
      homeScore: orm.homeScore,
      awayScore: orm.awayScore,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: Match): MatchOrmEntity {
    const orm = new MatchOrmEntity();
    orm.id = domain.id;
    orm.externalId = domain.externalId;
    orm.competitionId = domain.competitionId;
    orm.homeTeamId = domain.homeTeamId;
    orm.awayTeamId = domain.awayTeamId;
    orm.matchDate = domain.matchDate;
    orm.status = domain.status;
    orm.homeScore = domain.homeScore;
    orm.awayScore = domain.awayScore;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
