import { PrismaClient } from "@prisma/client";

const gloablForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = gloablForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") gloablForPrisma.prisma = prisma;
