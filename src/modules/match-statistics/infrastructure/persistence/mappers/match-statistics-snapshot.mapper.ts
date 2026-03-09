import { MatchStatisticsSnapshot } from '../../../domain/entities/match-statistics-snapshot.entity';
import { MatchStatisticsSnapshotOrmEntity } from '../entities/match-statistics-snapshot.orm-entity';

export class MatchStatisticsSnapshotMapper {
  static toDomain(orm: MatchStatisticsSnapshotOrmEntity): MatchStatisticsSnapshot {
    return new MatchStatisticsSnapshot({
      id: orm.id,
      matchId: orm.match.id,
      minute: orm.minute,
      possessionHome: Number(orm.possessionHome),
      possessionAway: Number(orm.possessionAway),
      shotsHome: orm.shotsHome,
      shotsAway: orm.shotsAway,
      shotsOnTargetHome: orm.shotsOnTargetHome,
      shotsOnTargetAway: orm.shotsOnTargetAway,
      cornersHome: orm.cornersHome,
      cornersAway: orm.cornersAway,
      foulsHome: orm.foulsHome,
      foulsAway: orm.foulsAway,
      yellowCardsHome: orm.yellowCardsHome,
      yellowCardsAway: orm.yellowCardsAway,
      redCardsHome: orm.redCardsHome,
      redCardsAway: orm.redCardsAway,
      createdAt: orm.createdAt,
    });
  }

  static toOrm(domain: MatchStatisticsSnapshot): MatchStatisticsSnapshotOrmEntity {
    const orm = new MatchStatisticsSnapshotOrmEntity();
    orm.id = domain.id;
    orm.match = { id: domain.matchId } as any;
    orm.minute = domain.minute;
    orm.possessionHome = domain.possessionHome;
    orm.possessionAway = domain.possessionAway;
    orm.shotsHome = domain.shotsHome;
    orm.shotsAway = domain.shotsAway;
    orm.shotsOnTargetHome = domain.shotsOnTargetHome;
    orm.shotsOnTargetAway = domain.shotsOnTargetAway;
    orm.cornersHome = domain.cornersHome;
    orm.cornersAway = domain.cornersAway;
    orm.foulsHome = domain.foulsHome;
    orm.foulsAway = domain.foulsAway;
    orm.yellowCardsHome = domain.yellowCardsHome;
    orm.yellowCardsAway = domain.yellowCardsAway;
    orm.redCardsHome = domain.redCardsHome;
    orm.redCardsAway = domain.redCardsAway;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
