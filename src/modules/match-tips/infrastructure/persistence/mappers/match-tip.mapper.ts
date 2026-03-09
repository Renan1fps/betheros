import { MatchTip } from '../../../domain/entities/match-tip.entity';
import { MatchTipOrmEntity } from '../entities/match-tip.orm-entity';

export class MatchTipMapper {
  static toDomain(orm: MatchTipOrmEntity): MatchTip {
    return new MatchTip({
      id: orm.id,
      matchId: orm.match.id,
      analysisId: orm.analysis.id,
      minute: orm.minute,
      tipType: orm.tipType,
      suggestedTeamId: orm.suggestedTeamId,
      confidence: Number(orm.confidence),
      createdAt: orm.createdAt,
    });
  }

  static toOrm(domain: MatchTip): MatchTipOrmEntity {
    const orm = new MatchTipOrmEntity();
    orm.id = domain.id;
    orm.match = { id: domain.matchId } as any;
    orm.analysis = { id: domain.analysisId } as any;
    orm.minute = domain.minute;
    orm.tipType = domain.tipType;
    orm.suggestedTeamId = domain.suggestedTeamId;
    orm.confidence = domain.confidence;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
