import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import EmailProvider from "next-auth/providers/email";
import { registerSchema } from "@/lib/validations/schemas";
import nodemailer from "nodemailer";
import { addMinutes } from "date-fns";

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
  // @ts-expect-error - PrismaAdapter has a type mismatch with the latest NextAuth
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
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor ingrese email y contraseña");
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          try {
            const validatedData = registerSchema.parse({
              name: credentials.name || credentials.email.split('@')[0],
              email: credentials.email,
              password: credentials.password,
            });

            const hashedPassword = await hash(credentials.password, 12);

            user = await prisma.user.create({
              data: {
                name: validatedData.name,
                email: validatedData.email.toLowerCase(),
                password: hashedPassword,
                emailVerified: null,
                role: "USER",
                onboardingCompleted: false,
              },
            });

            // 1. Generar OTP de 6 dígitos
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = addMinutes(new Date(), 10); // OTP válido por 10 minutos

            // 2. Guardar OTP en VerificationToken
            await prisma.verificationToken.create({
              data: {
                identifier: user.email,
                token: otp,
                expires,
              },
            });

            // 3. Enviar OTP por correo
            const transporter = nodemailer.createTransport({
              host: process.env.EMAIL_SERVER,
              port: Number(process.env.EMAIL_PORT),
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
              },
            });

            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: user.email,
              subject: "Tu código de verificación (Podium)",
              text: `Tu código de verificación es: ${otp}\n\nEste código es válido por 10 minutos.\n\nEquipo Podium`,
              html: `
                <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
                  <div style="max-width: 400px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px; text-align: center;">
                    <h1 style="color: #1a202c; font-size: 2rem; margin-bottom: 8px;">Podium</h1>
                    <h2 style="color: #4f46e5; font-size: 1.2rem; margin-bottom: 24px;">Verifica tu correo electrónico</h2>
                    <p style="font-size: 1rem; color: #333; margin-bottom: 16px;">Tu código de verificación es:</p>
                    <div style="font-size: 2.5rem; font-weight: bold; letter-spacing: 0.5rem; color: #4f46e5; background: #f1f5f9; border-radius: 8px; padding: 16px 0; margin-bottom: 24px;">${otp}</div>
                    <p style="font-size: 0.95rem; color: #666;">Este código es válido por <b>10 minutos</b>.</p>
                    <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 0.9rem; color: #888;">Si no solicitaste este código, puedes ignorar este mensaje.<br/>Equipo Podium</p>
                  </div>
                </div>
              `,
            });

            console.log("Usuario registrado automáticamente:", user.email);
            console.log("OTP enviado a:", user.email, "OTP:", otp);
          } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw new Error("Error al crear la cuenta");
          }
        } else {
          if (!user.password) {
            throw new Error("Este email está registrado con otro método de autenticación");
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Contraseña incorrecta");
          }
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
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params) {
        console.log('EMAIL PARAMS:', params);
        // puedes llamar aquí a nodemailer directamente para debug
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Al iniciar sesión por primera vez (user object está presente)
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
        return token;
      }

      // 2. Cuando la sesión se actualiza explícitamente (ej. después del onboarding)
      if (trigger === 'update' && session?.user) {
        // Recargamos los datos del usuario desde la BD para asegurar que estén frescos
        const refreshedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (refreshedUser) {
          token.onboardingCompleted = refreshedUser.onboardingCompleted;
          token.name = refreshedUser.name;
          token.role = refreshedUser.role;
        }
      }

      // 3. En cualquier otro caso, devolvemos el token como está
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