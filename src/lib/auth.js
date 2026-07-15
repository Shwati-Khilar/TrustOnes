// Login user using email/password
// Compare password with hashed password
// Store id, role, and status inside JWT/session
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!user.passwordHash) {
          throw new Error("USE_GOOGLE_LOGIN");
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isPasswordCorrect) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        if (user.status === "SUSPENDED") {
          throw new Error("ACCOUNT_SUSPENDED");
        }

        if (!user.role || user.status === "PENDING") {
          throw new Error("PROFILE_INCOMPLETE");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          provider: user.provider,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase().trim();

        if (!email) {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || "Google User",
              email,
              image: user.image || null,
              provider: "google",
              passwordHash: null,
              role: null,
              status: "PENDING",
              emailVerified: true,
              verificationToken: null,
              verificationTokenExpiry: null,
            },
          });

          return true;
        }

        if (existingUser.status === "SUSPENDED") {
          return false;
        }

        await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            image: user.image || existingUser.image,
            emailVerified: true,
            verificationToken: null,
            verificationTokenExpiry: null,
            status: existingUser.role ? "ACTIVE" : "PENDING",
          },
        });
      }

      return true;
    },

    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email.toLowerCase().trim(),
        },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.status = dbUser.status;
        token.emailVerified = dbUser.emailVerified;
        token.provider = dbUser.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.emailVerified = token.emailVerified;
        session.user.provider = token.provider;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };