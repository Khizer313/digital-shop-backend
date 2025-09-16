// ./config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('PGHOST', 'postgres.railway.internal'),
      port: env.int('PGPORT', 5432),
      database: env('PGDATABASE', 'railway'),
      user: env('PGUSER', 'postgres'),
      password: env('PGPASSWORD', 'lHwyhBaTYxcAYFtEpuCyqwxEqhbCalTR'),
      ssl:  false,
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    }
  },
});
