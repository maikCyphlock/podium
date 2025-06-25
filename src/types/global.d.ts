import { PrismaClient } from '@prisma/client';

declare global {
  // Extend the global NodeJS namespace
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined;
    }
  }

  // This allows us to use `prisma` directly in our code without importing it
  // in every file. This is particularly useful in development to prevent
  // multiple instances of Prisma Client in development.
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// This is needed to make the file a module
export {};
