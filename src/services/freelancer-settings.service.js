import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const AVAILABILITY_VALUES = ["AVAILABLE", "BUSY_OPEN", "NOT_AVAILABLE"];

function cleanAvailability(value) {
  if (AVAILABILITY_VALUES.includes(value)) return value;
  return "AVAILABLE";
}

function formatDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function cleanText(value, maxLength = 500) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

function cleanName(value) {
  const name = cleanText(value, 80);

  if (!name || name.length < 2) {
    throw new Error("Name must be at least 2 characters.");
  }

  return name;
}

function cleanPassword(value) {
  if (typeof value !== "string") return "";

  return value;
}

export async function getFreelancerSettings(freelancerId) {
  const user = await prisma.user.findUnique({
    where: {
      id: freelancerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      provider: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: true,
      freelancerProfile: {
        select: {
          availability: true,
          location: true,
          professionalTitle: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    account: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      hasPassword: Boolean(user.passwordHash),
      joinedAt: user.createdAt.toISOString(),
      joinedAtDisplay: formatDate(user.createdAt),
      updatedAt: user.updatedAt.toISOString(),
      updatedAtDisplay: formatDate(user.updatedAt),
    },

    freelancer: {
      availability: user.freelancerProfile?.availability || "AVAILABLE",
      location: user.freelancerProfile?.location || "",
      professionalTitle:
        user.freelancerProfile?.professionalTitle || "Freelance Developer",
    },

    preferences: {
      emailNotifications: true,
      milestoneAlerts: true,
      proposalAlerts: true,
      walletAlerts: true,
      theme: "SYSTEM",
      language: "EN",
    },
  };
}

export async function updateFreelancerAccountSettings(freelancerId, payload) {
  const name = cleanName(payload.name);
  const availability = cleanAvailability(payload.availability);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: freelancerId,
      },
      data: {
        name,
      },
    }),

    prisma.freelancerProfile.upsert({
      where: {
        userId: freelancerId,
      },
      update: {
        availability,
      },
      create: {
        userId: freelancerId,
        availability,
      },
    }),
  ]);

  return getFreelancerSettings(freelancerId);
}
export async function updateFreelancerPassword(freelancerId, payload) {
  const currentPassword = cleanPassword(payload.currentPassword);
  const newPassword = cleanPassword(payload.newPassword);

  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: freelancerId,
    },
    select: {
      id: true,
      passwordHash: true,
      provider: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.passwordHash) {
    throw new Error("Password change is not available for social login accounts.");
  }

  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!validPassword) {
    throw new Error("Current password is incorrect.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: freelancerId,
    },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return {
    passwordUpdated: true,
  };
}