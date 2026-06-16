import 'dotenv/config';

const drivers = {
  mysql: './mysql.js',
  postgres: './postgres.js',
  mongodb: './mongodb.js'
};

const DB_TYPE = process.env.DB_TYPE;

if (!drivers[DB_TYPE]) {
  throw new Error('Invalid DB_TYPE');
}

const db = (await import(drivers[DB_TYPE])).default;

export default db;