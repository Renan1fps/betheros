import { Injectable } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { IMatchRepository, FindMatchesFilters } from '../../../domain/repositories/match.repository';
import { Match } from '../../../domain/entities/match.entity';
import { MatchOrmEntity } from '../entities/match.orm-entity';
import { MatchMapper } from '../mappers/match.mapper';

@Injectable()
export class MatchRepository implements IMatchRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<Match | null> {
    const orm = await this.em.findOne(MatchOrmEntity, { id });
    return orm ? MatchMapper.toDomain(orm) : null;
  }

  async findByExternalId(externalId: string): Promise<Match | null> {
    const orm = await this.em.findOne(MatchOrmEntity, { externalId });
    return orm ? MatchMapper.toDomain(orm) : null;
  }

  async findByFilters(filters: FindMatchesFilters): Promise<Match[]> {
    const where: FilterQuery<MatchOrmEntity> = {};
    if (filters.competitionId) where.competitionId = filters.competitionId;
    if (filters.homeTeamId) where.homeTeamId = filters.homeTeamId;
    if (filters.awayTeamId) where.awayTeamId = filters.awayTeamId;
    if (filters.status) where.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      where.matchDate = {};
      if (filters.dateFrom) where.matchDate = { ...where.matchDate as object, $gte: filters.dateFrom };
      if (filters.dateTo) where.matchDate = { ...where.matchDate as object, $lte: filters.dateTo };
    }
    const orms = await this.em.find(MatchOrmEntity, where);
    return orms.map(MatchMapper.toDomain);
  }

  async findAll(): Promise<Match[]> {
    const orms = await this.em.findAll(MatchOrmEntity);
    return orms.map(MatchMapper.toDomain);
  }

  async save(match: Match): Promise<Match> {
    const orm = MatchMapper.toOrm(match);
    await this.em.persistAndFlush(orm);
    return MatchMapper.toDomain(orm);
  }

  async update(match: Match): Promise<Match> {
    const existing = await this.em.findOneOrFail(MatchOrmEntity, { id: match.id });
    existing.status = match.status;
    existing.homeScore = match.homeScore;
    existing.awayScore = match.awayScore;
    existing.updatedAt = new Date();
    await this.em.flush();
    return MatchMapper.toDomain(existing);
  }

  async delete(id: string): Promise<void> {
    const orm = await this.em.findOneOrFail(MatchOrmEntity, { id });
    await this.em.removeAndFlush(orm);
  }
}
