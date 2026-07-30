import { prisma } from "@/lib/prisma";

const AVAILABILITY_VALUES = ["AVAILABLE", "BUSY_OPEN", "NOT_AVAILABLE"];

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

function cleanText(value, maxLength = 500) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

function cleanEnum(value, allowedValues, fallback) {
  if (allowedValues.includes(value)) return value;
  return fallback;
}

function cleanStartingPrice(value) {
  if (value === null || value === undefined || value === "") return null;

  const amount = Number(value);

  if (!Number.isFinite(amount)) return null;
  if (amount < 0) return null;
  if (amount > 99999999) return 99999999;

  return amount;
}

function cleanSkills(value) {
  if (!Array.isArray(value)) return [];

  const unique = new Set();

  for (const item of value) {
    if (typeof item !== "string") continue;

    const skill = item.trim().slice(0, 40);

    if (skill) {
      unique.add(skill);
    }
  }

  return Array.from(unique).slice(0, 20);
}

function cleanPortfolioLinks(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const label = cleanText(item.label, 40);
      const url = cleanText(item.url, 200);

      if (!label || !url) return null;

      return {
        label,
        url,
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

function calculateTrustScore({
  activeProjects,
  completedProjects,
  approvedMilestones,
  revisionMilestones,
}) {
  let score = 70;

  score += Math.min(activeProjects * 3, 9);
  score += Math.min(completedProjects * 5, 15);
  score += Math.min(approvedMilestones * 2, 12);
  score -= Math.min(revisionMilestones * 4, 16);

  if (score > 100) return 100;
  if (score < 40) return 40;

  return score;
}

function getDefaultFreelancerProfile(user) {
  return {
    phone: "",
    location: "",
    availability: "AVAILABLE",
    professionalTitle: "Freelance Developer",
    bio: `${user.name || "This freelancer"} is building their TrustOnes freelancer profile.`,
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
    return getDefaultFreelancerProfile(user);
  }

  const startingPrice = profile.startingPrice
    ? Number(profile.startingPrice)
    : "";

  return {
    phone: profile.phone || "",
    location: profile.location || "",
    availability: profile.availability || "AVAILABLE",
    professionalTitle: profile.professionalTitle || "Freelance Developer",
    bio:
      profile.bio ||
      `${user.name || "This freelancer"} is building their TrustOnes freelancer profile.`,
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

  const trustScore = calculateTrustScore({
    activeProjects,
    completedProjects,
    approvedMilestones,
    revisionMilestones,
  });

  return {
    trustScore,
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

export async function updateFreelancerProfile(freelancerId, payload) {
  const updateData = {
    phone: cleanText(payload.phone, 30),
    location: cleanText(payload.location, 120),
    availability: cleanEnum(
      payload.availability,
      AVAILABILITY_VALUES,
      "AVAILABLE"
    ),
    professionalTitle: cleanText(payload.professionalTitle, 100),
    bio: cleanText(payload.bio, 1000),
    experienceLevel: cleanEnum(
      payload.experienceLevel,
      EXPERIENCE_VALUES,
      "INTERMEDIATE"
    ),
    startingPrice: cleanStartingPrice(payload.startingPrice),
    skills: cleanSkills(payload.skills),
    portfolioLinks: cleanPortfolioLinks(payload.portfolioLinks),
    educationHighlight: cleanText(payload.educationHighlight, 200),
  };

  await prisma.freelancerProfile.upsert({
    where: {
      userId: freelancerId,
    },
    update: updateData,
    create: {
      userId: freelancerId,
      ...updateData,
    },
  });

  return getFreelancerProfile(freelancerId);
}