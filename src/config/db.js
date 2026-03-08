import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './index.js';

const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
});
export const prisma = new PrismaClient({ adapter });

export async function connectDb() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
}
