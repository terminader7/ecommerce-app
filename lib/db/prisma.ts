import { PrismaClient } from "@prisma/client";

const gloablForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaBase = gloablForPrisma.prisma ?? new PrismaClient();

export const prisma = prismaBase.$extends({
  query: {
    cart: {
      async update({ args, query }) {
        args.data = { ...args.data, updatedAt: new Date() };
        return query(args);
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") gloablForPrisma.prisma = prismaBase;
