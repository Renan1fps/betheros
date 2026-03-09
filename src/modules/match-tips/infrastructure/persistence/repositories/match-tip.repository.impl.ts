import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IMatchTipRepository } from '../../../domain/repositories/match-tip.repository';
import { MatchTip } from '../../../domain/entities/match-tip.entity';
import { MatchTipOrmEntity } from '../entities/match-tip.orm-entity';
import { MatchTipMapper } from '../mappers/match-tip.mapper';

@Injectable()
export class MatchTipRepository implements IMatchTipRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<MatchTip | null> {
    const orm = await this.em.findOne(MatchTipOrmEntity, { id }, { populate: ['match', 'analysis'] });
    return orm ? MatchTipMapper.toDomain(orm) : null;
  }

  async findByMatchId(matchId: string): Promise<MatchTip[]> {
    const orms = await this.em.find(
      MatchTipOrmEntity,
      { match: { id: matchId } },
      { populate: ['match', 'analysis'], orderBy: { minute: 'ASC' } },
    );
    return orms.map(MatchTipMapper.toDomain);
  }

  async findByAnalysisId(analysisId: string): Promise<MatchTip[]> {
    const orms = await this.em.find(
      MatchTipOrmEntity,
      { analysis: { id: analysisId } },
      { populate: ['match', 'analysis'] },
    );
    return orms.map(MatchTipMapper.toDomain);
  }

  async findAll(): Promise<MatchTip[]> {
    const orms = await this.em.findAll(MatchTipOrmEntity, { populate: ['match', 'analysis'] });
    return orms.map(MatchTipMapper.toDomain);
  }

  async save(tip: MatchTip): Promise<MatchTip> {
    const orm = MatchTipMapper.toOrm(tip);
    await this.em.persistAndFlush(orm);
    return MatchTipMapper.toDomain(orm);
  }

  async update(tip: MatchTip): Promise<MatchTip> {
    const existing = await this.em.findOneOrFail(MatchTipOrmEntity, { id: tip.id });
    Object.assign(existing, MatchTipMapper.toOrm(tip));
    await this.em.flush();
    return MatchTipMapper.toDomain(existing);
  }

  async delete(id: string): Promise<void> {
    const orm = await this.em.findOneOrFail(MatchTipOrmEntity, { id });
    await this.em.removeAndFlush(orm);
  }
}
