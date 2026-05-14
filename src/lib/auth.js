// Login user using email/password
// Compare password with hashed password
// Store id, role, and status inside JWT/session
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

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
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isPasswordCorrect) {
          return null;
        }

        if (
          user.status !== "ACTIVE" ||
          !user.emailVerified
        ) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],

  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.role = user.role;
  //       token.status = user.status;
  //     }

  //     return token;
  //   },

  //   async session({ session, token }) {
  //     if (session.user) {
  //       session.user.id = token.id;
  //       session.user.role = token.role;
  //       session.user.status = token.status;
  //     }

  //     return session;
  //   },
  // },

  callbacks: {
    async signIn({ user, account }) {

      // GOOGLE LOGIN FLOW
      if (account.provider === "google") {

        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        // Create user if doesn't exist
        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || "Google User",
              email: user.email,
              image: user.image || null,
              provider: "google",
              role: "CLIENT",
              status: "ACTIVE",
              emailVerified: true,
            },
          });
        }
      }

      return true;
    },

    async jwt({ token }) {

      if (!token.email) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.status = dbUser.status;
      }

      return token;
    },

    async session({ session, token }) {

      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };