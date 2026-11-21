import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { createRawToken, hashToken } from "@/lib/tokens";

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
    if (!existingUser.emailVerified) {
      return {
        success: false,
        status: 409,
        message:
          "This email is already registered but not verified. Please verify your email.",
        redirectTo: `/verify-email?email=${encodeURIComponent(normalizedEmail)}`,
      };
    }

    return {
      success: false,
      status: 409,
      message: "An account already exists with this email.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Generate raw token for email link
  const rawVerificationToken = createRawToken();

  // Store only hashed token in database
  const hashedVerificationToken = hashToken(rawVerificationToken);

  const verificationTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      provider: "credentials",
      status: "PENDING",
      verificationToken: hashedVerificationToken,
      verificationTokenExpiry,
      emailVerified: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  try {
    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token: rawVerificationToken,
    });

    return {
      success: true,
      status: 201,
      message:
        "Account created successfully. Please check your email to verify your account.",
      user,
      redirectTo: `/verify-email?email=${encodeURIComponent(user.email)}`,
    };
  } catch (error) {
    console.error("SEND_VERIFICATION_EMAIL_ERROR", error);

    return {
      success: true,
      status: 201,
      message:
        "Account created, but verification email could not be sent. Please use resend verification email.",
      user,
      redirectTo: `/verify-email?email=${encodeURIComponent(user.email)}`,
    };
  }
}