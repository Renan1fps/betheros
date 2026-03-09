import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
    CreateMatchUseCase,
    GetMatchUseCase,
    ListMatchesUseCase
} from "@modules/matches/application/use-cases/match.use-cases";
import { CreateMatchDto, MatchResponseDto } from "@modules/matches/infrastructure/http/dtos/match.dto";

@ApiTags('matches')
@Controller('matches')
export class MatchController {
  constructor(
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly getMatchUseCase: GetMatchUseCase,
    private readonly listMatchesUseCase: ListMatchesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a match' })
  @ApiResponse({ status: 201, type: MatchResponseDto })
  async create(@Body() dto: CreateMatchDto): Promise<MatchResponseDto> {
    const match = await this.createMatchUseCase.execute({
      ...dto,
      matchDate: new Date(dto.matchDate),
    });
    return MatchResponseDto.fromDomain(match);
  }

  @Get()
  @ApiOperation({ summary: 'List matches with optional filters' })
  @ApiResponse({ status: 200, type: [MatchResponseDto] })
  @ApiQuery({ name: 'competitionId', required: false })
  @ApiQuery({ name: 'homeTeamId', required: false })
  @ApiQuery({ name: 'awayTeamId', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query() query: any): Promise<MatchResponseDto[]> {
    const matches = await this.listMatchesUseCase.execute({
      competitionId: query.competitionId,
      homeTeamId: query.homeTeamId,
      awayTeamId: query.awayTeamId,
      status: query.status,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
    return matches.map(MatchResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match by id' })
  @ApiResponse({ status: 200, type: MatchResponseDto })
  async findOne(@Param('id') id: string): Promise<MatchResponseDto> {
    const match = await this.getMatchUseCase.execute(id);
    return MatchResponseDto.fromDomain(match);
  }
}
