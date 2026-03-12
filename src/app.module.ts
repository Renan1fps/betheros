import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from '@modules/users/users.module';
import { SubscriptionsModule } from '@modules/subscriptions/subscriptions.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { MatchesModule } from '@modules/matches/matches.module';
import { MatchStatisticsModule } from '@modules/match-statistics/match-statistics.module';
import { MatchAnalysesModule } from '@modules/match-analyses/match-analyses.module';
import { MatchTipsModule } from '@modules/match-tips/match-tips.module';
import mikroOrmConfig from './shared/infrastructure/database/mikro-orm.config';
import { AuthModule } from "@modules/auth/auth.module";
import { StripeModule } from "@modules/stripe/stripe.module";
import { HealthCheckController } from "@shared/infrastructure/http/health-check.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    UsersModule,
    SubscriptionsModule,
    PaymentsModule,
    MatchesModule,
    MatchStatisticsModule,
    MatchAnalysesModule,
    MatchTipsModule,
    StripeModule,
    AuthModule
  ],
  controllers: [HealthCheckController],
})
export class AppModule {}
