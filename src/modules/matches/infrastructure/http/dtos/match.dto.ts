import { IsString, IsUUID, IsDateString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match, MatchStatus } from '../../domain/entities/match.entity';

export class CreateMatchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiProperty()
  @IsUUID()
  competitionId: string;

  @ApiProperty()
  @IsUUID()
  homeTeamId: string;

  @ApiProperty()
  @IsUUID()
  awayTeamId: string;

  @ApiProperty()
  @IsDateString()
  matchDate: string;

  @ApiProperty({ enum: ['scheduled', 'live', 'finished', 'cancelled', 'postponed'] })
  @IsEnum(['scheduled', 'live', 'finished', 'cancelled', 'postponed'])
  status: MatchStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  homeScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  awayScore?: number;
}

export class MatchResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() externalId?: string;
  @ApiProperty() competitionId: string;
  @ApiProperty() homeTeamId: string;
  @ApiProperty() awayTeamId: string;
  @ApiProperty() matchDate: Date;
  @ApiProperty() status: MatchStatus;
  @ApiPropertyOptional() homeScore?: number;
  @ApiPropertyOptional() awayScore?: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  static fromDomain(m: Match): MatchResponseDto {
    const dto = new MatchResponseDto();
    Object.assign(dto, {
      id: m.id, externalId: m.externalId, competitionId: m.competitionId,
      homeTeamId: m.homeTeamId, awayTeamId: m.awayTeamId, matchDate: m.matchDate,
      status: m.status, homeScore: m.homeScore, awayScore: m.awayScore,
      createdAt: m.createdAt, updatedAt: m.updatedAt,
    });
    return dto;
  }
}
