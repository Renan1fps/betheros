import { Migration } from '@mikro-orm/migrations';

export class Migration20260310220803_AddExtraInfosForSubscriptions extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "subscriptions" add column "external_subscription_id" varchar(255) not null, add column "gateway" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "subscriptions" drop column "external_subscription_id", drop column "gateway";`);
  }

}
