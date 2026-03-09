import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  dbName: process.env.DB_NAME ?? 'football_db',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  schema: process.env.DB_SCHEMA ?? 'public',
  entities: ['dist/**/*.orm-entity.js'],
  entitiesTs: ['src/**/*.orm-entity.ts'],
  debug: process.env.NODE_ENV === 'development',
  extensions: [Migrator],
  migrations: {
    path: 'dist/shared/infrastructure/database/migrations',
    pathTs: 'src/shared/infrastructure/database/migrations',
    glob: '!(*.d).{js,ts}',
  },
});
