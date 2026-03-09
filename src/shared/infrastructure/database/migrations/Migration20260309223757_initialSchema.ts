import { Migration } from '@mikro-orm/migrations';

export class Migration20260309223757_initialSchema extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "matches" ("id" uuid not null, "external_id" varchar(255) null, "competition_id" uuid not null, "home_team_id" uuid not null, "away_team_id" uuid not null, "match_date" timestamptz not null, "status" varchar(255) not null, "home_score" int null, "away_score" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "matches_pkey" primary key ("id"));`);

    this.addSql(`create table "match_analyses" ("id" uuid not null, "match_id" uuid not null, "minute" int not null, "model_version" varchar(255) not null, "home_win_probability" numeric(5,4) not null, "draw_probability" numeric(5,4) not null, "away_win_probability" numeric(5,4) not null, "first_half_home_win_probability" numeric(5,4) not null, "first_half_draw_probability" numeric(5,4) not null, "first_half_away_win_probability" numeric(5,4) not null, "created_at" timestamptz not null, constraint "match_analyses_pkey" primary key ("id"));`);

    this.addSql(`create table "match_statistics_snapshots" ("id" uuid not null, "match_id" uuid not null, "minute" int not null, "possession_home" numeric(5,2) not null, "possession_away" numeric(5,2) not null, "shots_home" int not null, "shots_away" int not null, "shots_on_target_home" int not null, "shots_on_target_away" int not null, "corners_home" int not null, "corners_away" int not null, "fouls_home" int not null, "fouls_away" int not null, "yellow_cards_home" int not null, "yellow_cards_away" int not null, "red_cards_home" int not null, "red_cards_away" int not null, "created_at" timestamptz not null, constraint "match_statistics_snapshots_pkey" primary key ("id"));`);

    this.addSql(`create table "match_tips" ("id" uuid not null, "match_id" uuid not null, "analysis_id" uuid not null, "minute" int not null, "tip_type" varchar(255) not null, "suggested_team_id" uuid null, "confidence" numeric(5,4) not null, "created_at" timestamptz not null, constraint "match_tips_pkey" primary key ("id"));`);

    this.addSql(`create table "users" ("id" uuid not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "user_auth_providers" ("id" uuid not null, "user_id" uuid not null, "provider" varchar(255) not null, "provider_user_id" varchar(255) not null, "created_at" timestamptz not null, constraint "user_auth_providers_pkey" primary key ("id"));`);

    this.addSql(`create table "subscriptions" ("id" uuid not null, "user_id" uuid not null, "status" varchar(255) not null, "plan" varchar(255) not null, "started_at" timestamptz not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, constraint "subscriptions_pkey" primary key ("id"));`);

    this.addSql(`create table "payments" ("id" uuid not null, "subscription_id" uuid not null, "gateway" varchar(255) not null, "external_payment_id" varchar(255) not null, "amount" numeric(10,2) not null, "currency" varchar(255) not null, "status" varchar(255) not null, "paid_at" timestamptz null, "created_at" timestamptz not null, constraint "payments_pkey" primary key ("id"));`);

    this.addSql(`alter table "match_analyses" add constraint "match_analyses_match_id_foreign" foreign key ("match_id") references "matches" ("id") on update cascade;`);

    this.addSql(`alter table "match_statistics_snapshots" add constraint "match_statistics_snapshots_match_id_foreign" foreign key ("match_id") references "matches" ("id") on update cascade;`);

    this.addSql(`alter table "match_tips" add constraint "match_tips_match_id_foreign" foreign key ("match_id") references "matches" ("id") on update cascade;`);
    this.addSql(`alter table "match_tips" add constraint "match_tips_analysis_id_foreign" foreign key ("analysis_id") references "match_analyses" ("id") on update cascade;`);

    this.addSql(`alter table "user_auth_providers" add constraint "user_auth_providers_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "subscriptions" add constraint "subscriptions_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "payments" add constraint "payments_subscription_id_foreign" foreign key ("subscription_id") references "subscriptions" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "match_analyses" drop constraint "match_analyses_match_id_foreign";`);

    this.addSql(`alter table "match_statistics_snapshots" drop constraint "match_statistics_snapshots_match_id_foreign";`);

    this.addSql(`alter table "match_tips" drop constraint "match_tips_match_id_foreign";`);

    this.addSql(`alter table "match_tips" drop constraint "match_tips_analysis_id_foreign";`);

    this.addSql(`alter table "user_auth_providers" drop constraint "user_auth_providers_user_id_foreign";`);

    this.addSql(`alter table "subscriptions" drop constraint "subscriptions_user_id_foreign";`);

    this.addSql(`alter table "payments" drop constraint "payments_subscription_id_foreign";`);

    this.addSql(`drop table if exists "matches" cascade;`);

    this.addSql(`drop table if exists "match_analyses" cascade;`);

    this.addSql(`drop table if exists "match_statistics_snapshots" cascade;`);

    this.addSql(`drop table if exists "match_tips" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "user_auth_providers" cascade;`);

    this.addSql(`drop table if exists "subscriptions" cascade;`);

    this.addSql(`drop table if exists "payments" cascade;`);
  }

}
