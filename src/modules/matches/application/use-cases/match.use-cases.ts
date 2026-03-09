import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Match } from '../../domain/entities/match.entity';
import { IMatchRepository, MATCH_REPOSITORY, FindMatchesFilters } from '../../domain/repositories/match.repository';

@Injectable()
export class GetMatchUseCase {
  constructor(@Inject(MATCH_REPOSITORY) private readonly matchRepository: IMatchRepository) {}

  async execute(id: string): Promise<Match> {
    const match = await this.matchRepository.findById(id);
    if (!match) throw new NotFoundException(`Match ${id} not found`);
    return match;
  }
}

@Injectable()
export class ListMatchesUseCase {
  constructor(@Inject(MATCH_REPOSITORY) private readonly matchRepository: IMatchRepository) {}

  async execute(filters: FindMatchesFilters): Promise<Match[]> {
    return this.matchRepository.findByFilters(filters);
  }
}

@Injectable()
export class CreateMatchUseCase {
  constructor(@Inject(MATCH_REPOSITORY) private readonly matchRepository: IMatchRepository) {}

  async execute(props: Parameters<typeof Match.create>[0]): Promise<Match> {
    const match = Match.create(props);
    return this.matchRepository.save(match);
  }
}
