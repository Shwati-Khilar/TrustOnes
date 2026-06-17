// Validate input
// Check duplicate email
// Hash password
// Save user
// Never return passwordHash

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { transporter } from "@/lib/mail";
import { verifyEmailTemplate } from "@/lib/emailTemplates";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CLIENT", "FREELANCER"], {
    message: "Role must be CLIENT or FREELANCER",
  }),
});

export async function registerUser(input) {
  const validation = registerSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid input data",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = validation.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return {
      success: false,
      status: 409,
      message: "An account already exists with this email.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      status: "ACTIVE",
      verificationToken,
      verificationTokenExpiry,
      emailVerified: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    from: `"TrustOnes" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify your TrustOnes email",
    html: verifyEmailTemplate({
      userName: user.name,
      email: user.email,
      verifyUrl: verificationUrl,
    }),
  });

  return {
    success: true,
    status: 201,
    message: "User registered successfully.",
    user,
  };
}