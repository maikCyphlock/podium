import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    onboardingCompleted: boolean;
  }

  interface Session {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  // @ts-ignore - PrismaAdapter has a type mismatch with the latest NextAuth
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login?error=Unauthorized",
    newUser: "/onboarding"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor ingrese email y contraseña");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role,
          onboardingCompleted: user.onboardingCompleted || false
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};