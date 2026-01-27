import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Resolve the database path relative to the project root
const dbPath = path.resolve(process.cwd(), 'dev.db');
const connectionString = `file:${dbPath}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
