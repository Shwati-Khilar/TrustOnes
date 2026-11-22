import { prisma } from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { accountName, availability, nonemptyPatch } from "@/lib/account-fields";

const EXPERIENCE_VALUES = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getDefaultFreelancerProfile() {
  return {
    phone: "",
    location: "",
    availability: "AVAILABLE",
    professionalTitle: "",
    bio: "",
    experienceLevel: "INTERMEDIATE",
    startingPrice: "",
    startingPriceDisplay: "₹0",
    skills: [],
    portfolioLinks: [],
    educationHighlight: "",
  };
}

function mapFreelancerProfile(user) {
  const profile = user.freelancerProfile;

  if (!profile) {
    return getDefaultFreelancerProfile();
  }

  const startingPrice = profile.startingPrice
    ? Number(profile.startingPrice)
    : "";

  return {
    phone: profile.phone || "",
    location: profile.location || "",
    availability: profile.availability || "AVAILABLE",
    professionalTitle: profile.professionalTitle || "",
    bio:
      profile.bio ||
      "",
    experienceLevel: profile.experienceLevel || "INTERMEDIATE",
    startingPrice,
    startingPriceDisplay: formatCurrency(startingPrice || 0),
    skills: profile.skills || [],
    portfolioLinks: Array.isArray(profile.portfolioLinks)
      ? profile.portfolioLinks
      : [],
    educationHighlight: profile.educationHighlight || "",
  };
}

async function getFreelancerWorkStats(freelancerId) {
  const [
    totalProjects,
    activeProjects,
    completedProjects,
    totalProposals,
    pendingProposals,
    acceptedProposals,
    totalMilestones,
    approvedMilestones,
    revisionMilestones,
    approvedEarnings,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        freelancerId,
      },
    }),

    prisma.project.count({
      where: {
        freelancerId,
        status: "ACTIVE",
      },
    }),

    prisma.project.count({
      where: {
        freelancerId,
        status: "COMPLETED",
      },
    }),

    prisma.proposal.count({
      where: {
        freelancerId,
      },
    }),

    prisma.proposal.count({
      where: {
        freelancerId,
        status: "PENDING",
      },
    }),

    prisma.proposal.count({
      where: {
        freelancerId,
        status: "ACCEPTED",
      },
    }),

    prisma.milestone.count({
      where: {
        project: {
          freelancerId,
        },
      },
    }),

    prisma.milestone.count({
      where: {
        status: "APPROVED",
        project: {
          freelancerId,
        },
      },
    }),

    prisma.milestone.count({
      where: {
        status: "REJECTED",
        project: {
          freelancerId,
        },
      },
    }),

    prisma.milestone.aggregate({
      where: {
        status: "APPROVED",
        project: {
          freelancerId,
        },
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    trustScore: null,
    totalProjects,
    activeProjects,
    completedProjects,
    totalProposals,
    pendingProposals,
    acceptedProposals,
    totalMilestones,
    approvedMilestones,
    revisionMilestones,
    approvedEarnings: Number(approvedEarnings._sum.amount || 0),
    approvedEarningsDisplay: formatCurrency(approvedEarnings._sum.amount),
  };
}

function mapProfileResponse(user, stats) {
  const freelancerProfile = mapFreelancerProfile(user);

  return {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      joinedAt: user.createdAt.toISOString(),
      joinedAtDisplay: formatDate(user.createdAt),
      updatedAt: user.updatedAt.toISOString(),
    },

    freelancerProfile,

    stats,

    badges: [
      {
        label: "Verified Freelancer",
        active: user.emailVerified,
      },
      {
        label: "Active Account",
        active: user.status === "ACTIVE",
      },
      {
        label: "Proposal Builder",
        active: stats.totalProposals > 0,
      },
      {
        label: "Milestone Finisher",
        active: stats.approvedMilestones > 0,
      },
    ],
  };
}

export async function getFreelancerProfile(freelancerId) {
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
      freelancerProfile: {
        select: {
          phone: true,
          location: true,
          availability: true,
          professionalTitle: true,
          bio: true,
          experienceLevel: true,
          startingPrice: true,
          skills: true,
          portfolioLinks: true,
          educationHighlight: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const stats = await getFreelancerWorkStats(freelancerId);

  return mapProfileResponse(user, stats);
}

const textField = length => z.string().trim().max(length).transform(value => value || null).nullable();
const link = z.strictObject({
  label: z.string().trim().min(1).max(40),
  url: z.url({ protocol: /^https?$/ }).max(200),
});
const profilePatch = nonemptyPatch({
  name: accountName, availability, phone: textField(30), location: textField(120),
  professionalTitle: textField(100), bio: textField(1000), educationHighlight: textField(200),
  experienceLevel: z.enum(EXPERIENCE_VALUES),
  startingPrice: z.union([z.number(), z.string().regex(/^\d+(?:\.\d{1,2})?$/).transform(Number)])
    .pipe(z.number().min(0).max(99999999).multipleOf(0.01)).nullable(),
  skills: z.array(z.string().trim().min(1).max(40)).max(20).transform(items => [...new Set(items)]),
  portfolioLinks: z.array(link).max(8).nullable(),
});

export async function updateFreelancerProfile(userId, payload) {
  const { name, ...data } = profilePatch.parse(payload);
  if (data.portfolioLinks === null) data.portfolioLinks = Prisma.DbNull;
  await prisma.$transaction(async tx => {
    if (name !== undefined) await tx.user.update({ where: { id: userId }, data: { name } });
    if (Object.keys(data).length) {
      await tx.freelancerProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data });
    }
  });
  return getFreelancerProfile(userId);
}
