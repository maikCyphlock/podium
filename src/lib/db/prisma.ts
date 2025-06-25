import { PrismaClient } from '@prisma/client';

// Evitar múltiples instancias de Prisma en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Middleware para logging de consultas en desarrollo
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );
  }
  
  return result;
});

export default prisma;
