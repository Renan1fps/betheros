import { Migration } from '@mikro-orm/migrations';

export class Migration20260311205948_AddProviderSubscriptionId extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "payments" drop constraint "payments_subscription_id_foreign";`);

    this.addSql(`alter table "subscriptions" add column "provider_subscription_id" varchar(255) not null;`);

    this.addSql(`alter table "payments" alter column "subscription_id" drop default;`);
    this.addSql(`alter table "payments" alter column "subscription_id" type uuid using ("subscription_id"::text::uuid);`);
    this.addSql(`alter table "payments" alter column "subscription_id" drop not null;`);
    this.addSql(`alter table "payments" add constraint "payments_subscription_id_foreign" foreign key ("subscription_id") references "subscriptions" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "payments" drop constraint "payments_subscription_id_foreign";`);

    this.addSql(`alter table "payments" alter column "subscription_id" drop default;`);
    this.addSql(`alter table "payments" alter column "subscription_id" type uuid using ("subscription_id"::text::uuid);`);
    this.addSql(`alter table "payments" alter column "subscription_id" set not null;`);
    this.addSql(`alter table "payments" add constraint "payments_subscription_id_foreign" foreign key ("subscription_id") references "subscriptions" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "subscriptions" drop column "provider_subscription_id";`);
  }

}
