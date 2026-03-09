import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MatchTipOrmEntity } from './infrastructure/persistence/entities/match-tip.orm-entity';
import { MatchTipRepository } from './infrastructure/persistence/repositories/match-tip.repository.impl';
import { MATCH_TIP_REPOSITORY } from './domain/repositories/match-tip.repository';

@Module({
  imports: [MikroOrmModule.forFeature([MatchTipOrmEntity])],
  providers: [
    { provide: MATCH_TIP_REPOSITORY, useClass: MatchTipRepository },
  ],
  exports: [MATCH_TIP_REPOSITORY],
})
export class MatchTipsModule {}
