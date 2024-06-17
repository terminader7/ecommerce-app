import GoogleProvider from "next-auth/providers/google";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
// import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        await mergeAnonymousCartIntoUserCart(user.id);
      } catch (error) {
        console.error("Failed to merge anonymous cart into user cart:", error);
      }
    },
  },
};
