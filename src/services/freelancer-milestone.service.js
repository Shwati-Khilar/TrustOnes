import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
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
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDue(value) {
  if (!value) return "No due date";

  const today = new Date();
  const dueDate = new Date(value);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  return formatDate(value);
}

function mapStatusForFrontend(status) {
  const map = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    SUBMITTED: "SUBMITTED",
    APPROVED: "APPROVED",
    REJECTED: "REVISION_REQUESTED",
  };

  return map[status] || "PENDING";
}

function getNextAction(status) {
  const actions = {
    PENDING: "Start milestone work",
    IN_PROGRESS: "Submit completed work",
    SUBMITTED: "Waiting for client approval",
    APPROVED: "Milestone approved",
    REJECTED: "Revise and resubmit work",
  };

  return actions[status] || "Open milestone";
}

function mapMilestone(milestone) {
  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description || "No milestone description available.",
    amount: Number(milestone.amount || 0),
    amountDisplay: formatCurrency(milestone.amount),
    dueDate: milestone.dueDate ? milestone.dueDate.toISOString() : null,
    dueDateDisplay: formatDate(milestone.dueDate),
    due: formatDue(milestone.dueDate),
    status: mapStatusForFrontend(milestone.status),
    rawStatus: milestone.status,
    nextAction: getNextAction(milestone.status),
    createdAt: milestone.createdAt.toISOString(),
    updatedAt: milestone.updatedAt.toISOString(),

    project: milestone.project
      ? {
          id: milestone.project.id,
          title: milestone.project.title,
          status: milestone.project.status,
          category: milestone.project.category,
          deadline: milestone.project.deadline
            ? milestone.project.deadline.toISOString()
            : null,
          deadlineDisplay: formatDate(milestone.project.deadline),
        }
      : null,

    client: milestone.project?.client
      ? {
          id: milestone.project.client.id,
          name: milestone.project.client.name,
          image: milestone.project.client.image,
        }
      : null,
  };
}

export async function getFreelancerMilestones(freelancerId, filters = {}) {
  const status = String(filters.status || "ALL").toUpperCase();
  const search = String(filters.search || "").trim();

  const where = {
    project: {
      freelancerId,
    },
  };

  if (status !== "ALL") {
    if (status === "REVISION_REQUESTED") {
      where.status = "REJECTED";
    } else if (ALLOWED_STATUSES.includes(status)) {
      where.status = status;
    }
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
        project: {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        project: {
          client: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  const [
    milestones,
    totalMilestones,
    pendingCount,
    inProgressCount,
    submittedCount,
    approvedCount,
    rejectedCount,
    approvedAmount,
    activeAmount,
  ] = await Promise.all([
    prisma.milestone.findMany({
      where,
      orderBy: {
        dueDate: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        dueDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
            deadline: true,
            client: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
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
        status: "PENDING",
        project: {
          freelancerId,
        },
      },
    }),

    prisma.milestone.count({
      where: {
        status: "IN_PROGRESS",
        project: {
          freelancerId,
        },
      },
    }),

    prisma.milestone.count({
      where: {
        status: "SUBMITTED",
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

    prisma.milestone.aggregate({
      where: {
        status: {
          in: ["IN_PROGRESS", "SUBMITTED"],
        },
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
    stats: {
      totalMilestones,
      pendingMilestones: pendingCount,
      inProgressMilestones: inProgressCount,
      submittedMilestones: submittedCount,
      approvedMilestones: approvedCount,
      revisionRequestedMilestones: rejectedCount,
      approvedAmount: Number(approvedAmount._sum.amount || 0),
      approvedAmountDisplay: formatCurrency(approvedAmount._sum.amount),
      activeAmount: Number(activeAmount._sum.amount || 0),
      activeAmountDisplay: formatCurrency(activeAmount._sum.amount),
    },
    milestones: milestones.map(mapMilestone),
  };
}