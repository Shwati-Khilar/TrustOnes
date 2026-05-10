// Validate input
// Check duplicate email
// Hash password
// Save user
// Never return passwordHash

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    return {
      success: false,
      status: 409,
      message: "An account already exists with this email.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      status: "ACTIVE",
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

  return {
    success: true,
    status: 201,
    message: "User registered successfully.",
    user,
  };
}