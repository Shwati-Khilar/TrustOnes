// Login user using email/password
// Compare password with hashed password
// Store id, role, and status inside JWT/session
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { hashToken } from "@/lib/tokens";
import { signInWithGoogle } from "@/services/google-signin";
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

        if (user.status === "SUSPENDED") {
          throw new Error("ACCOUNT_SUSPENDED");
        }

        if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");

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
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;
      return signInWithGoogle(prisma.user, user, profile);
    },

    async jwt({ token, account }) {
      // Resolve provider identity by email once. Refresh only the same database user.
      const where = account && token.email
        ? { email: token.email.trim().toLowerCase() }
        : { id: token.id };
      if (!where.email && !where.id) return {};
      const identity = await prisma.user.findUnique({
        where,
        select: {
          id: true, email: true, role: true, status: true, name: true,
          image: true, emailVerified: true, provider: true, passwordHash: true,
        },
      });
      if (!identity) return {};
      const { passwordHash, ...claims } = identity;
      const credentialStamp = passwordHash ? hashToken(passwordHash) : null;
      if (!account && token.credentialStamp !== undefined && token.credentialStamp !== credentialStamp) {
        return {};
      }
      return { ...token, ...claims, credentialStamp };
    },

    async session({ session, token }) {
      if (!token.id) return { ...session, user: null };
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.emailVerified = token.emailVerified;
        session.user.provider = token.provider;
        session.user.hasPassword = Boolean(token.credentialStamp);
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };