import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IMatchStatisticsSnapshotRepository } from '../../../domain/repositories/match-statistics-snapshot.repository';
import { MatchStatisticsSnapshot } from '../../../domain/entities/match-statistics-snapshot.entity';
import { MatchStatisticsSnapshotOrmEntity } from '../entities/match-statistics-snapshot.orm-entity';
import { MatchStatisticsSnapshotMapper } from '../mappers/match-statistics-snapshot.mapper';

@Injectable()
export class MatchStatisticsSnapshotRepository implements IMatchStatisticsSnapshotRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<MatchStatisticsSnapshot | null> {
    const orm = await this.em.findOne(MatchStatisticsSnapshotOrmEntity, { id }, { populate: ['match'] });
    return orm ? MatchStatisticsSnapshotMapper.toDomain(orm) : null;
  }

  async findByMatchId(matchId: string): Promise<MatchStatisticsSnapshot[]> {
    const orms = await this.em.find(
      MatchStatisticsSnapshotOrmEntity,
      { match: { id: matchId } },
      { populate: ['match'], orderBy: { minute: 'ASC' } },
    );
    return orms.map(MatchStatisticsSnapshotMapper.toDomain);
  }

  async findByMatchIdAndMinute(matchId: string, minute: number): Promise<MatchStatisticsSnapshot | null> {
    const orm = await this.em.findOne(
      MatchStatisticsSnapshotOrmEntity,
      { match: { id: matchId }, minute },
      { populate: ['match'] },
    );
    return orm ? MatchStatisticsSnapshotMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<MatchStatisticsSnapshot[]> {
    const orms = await this.em.findAll(MatchStatisticsSnapshotOrmEntity, { populate: ['match'] });
    return orms.map(MatchStatisticsSnapshotMapper.toDomain);
  }

  async save(snapshot: MatchStatisticsSnapshot): Promise<MatchStatisticsSnapshot> {
    const orm = MatchStatisticsSnapshotMapper.toOrm(snapshot);
    await this.em.persistAndFlush(orm);
    return MatchStatisticsSnapshotMapper.toDomain(orm);
  }

  async update(snapshot: MatchStatisticsSnapshot): Promise<MatchStatisticsSnapshot> {
    const existing = await this.em.findOneOrFail(MatchStatisticsSnapshotOrmEntity, { id: snapshot.id });
    Object.assign(existing, MatchStatisticsSnapshotMapper.toOrm(snapshot));
    await this.em.flush();
    return MatchStatisticsSnapshotMapper.toDomain(existing);
  }

  async delete(id: string): Promise<void> {
    const orm = await this.em.findOneOrFail(MatchStatisticsSnapshotOrmEntity, { id });
    await this.em.removeAndFlush(orm);
  }
}
