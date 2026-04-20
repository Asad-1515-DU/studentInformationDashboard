import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export default prisma;

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
