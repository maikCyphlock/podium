import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      onboardingCompleted: boolean;
      profile?: {
        id: string;
        firstName: string;
        lastName: string;
        // Add other profile fields as needed
      } | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    onboardingCompleted: boolean;
    profile?: {
      id: string;
      firstName: string;
      lastName: string;
      // Add other profile fields as needed
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    onboardingCompleted: boolean;
    profile?: {
      id: string;
      firstName: string;
      lastName: string;
      // Add other profile fields as needed
    } | null;
  }
}
