import knex, { Knex } from 'knex';
import { env } from './env';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
  },
  pool: {
    min: env.db.poolMin,
    max: env.db.poolMax,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  migrations: {
    directory: './src/migrations',
    extension: 'ts',
  },
};

export const db = knex(knexConfig);

export default db;




