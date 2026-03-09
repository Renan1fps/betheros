import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IMatchAnalysisRepository } from '../../../domain/repositories/match-analysis.repository';
import { MatchAnalysis } from '../../../domain/entities/match-analysis.entity';
import { MatchAnalysisOrmEntity } from '../entities/match-analysis.orm-entity';
import { MatchAnalysisMapper } from '../mappers/match-analysis.mapper';

@Injectable()
export class MatchAnalysisRepository implements IMatchAnalysisRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<MatchAnalysis | null> {
    const orm = await this.em.findOne(MatchAnalysisOrmEntity, { id }, { populate: ['match'] });
    return orm ? MatchAnalysisMapper.toDomain(orm) : null;
  }

  async findByMatchId(matchId: string): Promise<MatchAnalysis[]> {
    const orms = await this.em.find(
      MatchAnalysisOrmEntity,
      { match: { id: matchId } },
      { populate: ['match'], orderBy: { minute: 'ASC' } },
    );
    return orms.map(MatchAnalysisMapper.toDomain);
  }

  async findLatestByMatchId(matchId: string): Promise<MatchAnalysis | null> {
    const orm = await this.em.findOne(
      MatchAnalysisOrmEntity,
      { match: { id: matchId } },
      { populate: ['match'], orderBy: { minute: 'DESC' } },
    );
    return orm ? MatchAnalysisMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<MatchAnalysis[]> {
    const orms = await this.em.findAll(MatchAnalysisOrmEntity, { populate: ['match'] });
    return orms.map(MatchAnalysisMapper.toDomain);
  }

  async save(analysis: MatchAnalysis): Promise<MatchAnalysis> {
    const orm = MatchAnalysisMapper.toOrm(analysis);
    await this.em.persistAndFlush(orm);
    return MatchAnalysisMapper.toDomain(orm);
  }

  async update(analysis: MatchAnalysis): Promise<MatchAnalysis> {
    const existing = await this.em.findOneOrFail(MatchAnalysisOrmEntity, { id: analysis.id });
    Object.assign(existing, MatchAnalysisMapper.toOrm(analysis));
    await this.em.flush();
    return MatchAnalysisMapper.toDomain(existing);
  }

  async delete(id: string): Promise<void> {
    const orm = await this.em.findOneOrFail(MatchAnalysisOrmEntity, { id });
    await this.em.removeAndFlush(orm);
  }
}
