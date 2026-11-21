import { prisma } from "@/lib/prisma";

const ALLOWED_PROJECT_STATUSES = [
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
];

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getNextAction(project) {
  const milestones = project.milestones || [];

  const rejected = milestones.find((item) => item.status === "REJECTED");
  if (rejected) return `Revise ${rejected.title}`;

  const inProgress = milestones.find((item) => item.status === "IN_PROGRESS");
  if (inProgress) return `Submit ${inProgress.title}`;

  const submitted = milestones.find((item) => item.status === "SUBMITTED");
  if (submitted) return `Waiting for approval: ${submitted.title}`;

  const pending = milestones.find((item) => item.status === "PENDING");
  if (pending) return `Start ${pending.title}`;

  if (project.status === "COMPLETED") return "Project completed";
  if (project.status === "PAUSED") return "Project paused";

  return "Open deal room";
}

function calculateProgress(milestones) {
  const total = milestones.length;

  if (total === 0) {
    return {
      total,
      completed: 0,
      progress: 0,
    };
  }

  const completed = milestones.filter(
    (milestone) => milestone.status === "APPROVED"
  ).length;

  return {
    total,
    completed,
    progress: Math.round((completed / total) * 100),
  };
}

function mapProject(project) {
  const milestoneProgress = calculateProgress(project.milestones || []);

  const approvedAmount = (project.milestones || []).reduce((sum, milestone) => {
    if (milestone.status === "APPROVED") {
      return sum + Number(milestone.amount || 0);
    }

    return sum;
  }, 0);

  const activeAmount = (project.milestones || []).reduce((sum, milestone) => {
    if (
      milestone.status === "IN_PROGRESS" ||
      milestone.status === "SUBMITTED"
    ) {
      return sum + Number(milestone.amount || 0);
    }

    return sum;
  }, 0);

  const acceptedProposal = project.proposals?.[0] || null;

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    category: project.category,
    status: project.status,

    budget: Number(project.budget || 0),
    budgetDisplay: formatCurrency(project.budget),

    deadline: project.deadline ? project.deadline.toISOString() : null,
    deadlineDisplay: formatDate(project.deadline),

    client: project.client
      ? {
          id: project.client.id,
          name: project.client.name,
          image: project.client.image,
        }
      : null,

    proposal: acceptedProposal
      ? {
          id: acceptedProposal.id,
          status: acceptedProposal.status,
          bidAmount: Number(acceptedProposal.bidAmount || 0),
          bidAmountDisplay: formatCurrency(acceptedProposal.bidAmount),
          estimatedDays: acceptedProposal.estimatedDays,
        }
      : null,

    milestoneSummary: {
      total: milestoneProgress.total,
      completed: milestoneProgress.completed,
      progress: milestoneProgress.progress,
      approvedAmount,
      approvedAmountDisplay: formatCurrency(approvedAmount),
      activeAmount,
      activeAmountDisplay: formatCurrency(activeAmount),
    },

    nextAction: getNextAction(project),

    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export async function getFreelancerProjects(freelancerId, filters = {}) {
  const status = String(filters.status || "ALL").toUpperCase();
  const search = String(filters.search || "").trim();

  const where = {
    freelancerId,
  };

  if (status !== "ALL" && ALLOWED_PROJECT_STATUSES.includes(status)) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        client: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const [projects, totalProjects, activeCount, pausedCount, completedCount] =
    await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          budget: true,
          deadline: true,
          status: true,
          createdAt: true,
          updatedAt: true,

          client: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },

          proposals: {
            where: {
              freelancerId,
            },
            take: 1,
            select: {
              id: true,
              bidAmount: true,
              estimatedDays: true,
              status: true,
            },
          },

          milestones: {
            orderBy: {
              dueDate: "asc",
            },
            select: {
              id: true,
              title: true,
              amount: true,
              dueDate: true,
              status: true,
            },
          },
        },
      }),

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
          status: "PAUSED",
        },
      }),

      prisma.project.count({
        where: {
          freelancerId,
          status: "COMPLETED",
        },
      }),
    ]);

  return {
    stats: {
      totalProjects,
      activeProjects: activeCount,
      pausedProjects: pausedCount,
      completedProjects: completedCount,
    },
    projects: projects.map(mapProject),
  };
}