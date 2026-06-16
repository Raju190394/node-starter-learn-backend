// Singleton Prisma client with MariaDB adapter
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Build adapter using distinct environment variables
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 30,
});

let prisma;
if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
    // Uncomment to enable query logging
    // global.prisma.$on('query', (e) => console.log(e));
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient({ adapter });
}

export default prisma;