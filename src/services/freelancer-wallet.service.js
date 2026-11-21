import { prisma } from "@/lib/prisma";

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

function mapTransactionFromMilestone(milestone) {
  const typeMap = {
    APPROVED: "EARNING_RELEASED",
    SUBMITTED: "PENDING_APPROVAL",
    IN_PROGRESS: "ACTIVE_WORK",
    REJECTED: "REVISION_PENDING",
    PENDING: "NOT_STARTED",
  };

  return {
    id: milestone.id,
    type: typeMap[milestone.status] || "MILESTONE",
    title: milestone.title,
    amount: Number(milestone.amount || 0),
    amountDisplay: formatCurrency(milestone.amount),
    status: milestone.status,
    date: milestone.updatedAt.toISOString(),
    dateDisplay: formatDate(milestone.updatedAt),
    project: milestone.project
      ? {
          id: milestone.project.id,
          title: milestone.project.title,
          client: milestone.project.client
            ? {
                id: milestone.project.client.id,
                name: milestone.project.client.name,
              }
            : null,
        }
      : null,
  };
}

export async function getFreelancerWallet(freelancerId) {
  const [
    approvedAmount,
    submittedAmount,
    activeAmount,
    revisionAmount,
    approvedCount,
    submittedCount,
    activeCount,
    recentMilestones,
  ] = await Promise.all([
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
        status: "SUBMITTED",
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
        status: "IN_PROGRESS",
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
        status: "REJECTED",
        project: {
          freelancerId,
        },
      },
      _sum: {
        amount: true,
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
        status: "SUBMITTED",
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

    prisma.milestone.findMany({
      where: {
        project: {
          freelancerId,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 12,
      select: {
        id: true,
        title: true,
        amount: true,
        status: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            title: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const approved = Number(approvedAmount._sum.amount || 0);
  const submitted = Number(submittedAmount._sum.amount || 0);
  const active = Number(activeAmount._sum.amount || 0);
  const revision = Number(revisionAmount._sum.amount || 0);

  return {
    summary: {
      availableBalance: approved,
      availableBalanceDisplay: formatCurrency(approved),

      pendingApproval: submitted,
      pendingApprovalDisplay: formatCurrency(submitted),

      activeWorkValue: active,
      activeWorkValueDisplay: formatCurrency(active),

      revisionValue: revision,
      revisionValueDisplay: formatCurrency(revision),

      totalTrackedValue: approved + submitted + active + revision,
      totalTrackedValueDisplay: formatCurrency(
        approved + submitted + active + revision
      ),
    },

    counts: {
      approvedMilestones: approvedCount,
      submittedMilestones: submittedCount,
      activeMilestones: activeCount,
    },

    transactions: recentMilestones.map(mapTransactionFromMilestone),
  };
}