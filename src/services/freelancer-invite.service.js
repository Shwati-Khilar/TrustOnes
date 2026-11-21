import { prisma } from "@/lib/prisma";

const ALLOWED_PROPOSAL_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
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

function getNextAction(status, projectStatus) {
  if (status === "PENDING") return "Waiting for client response";
  if (status === "ACCEPTED" && projectStatus === "ACTIVE") return "Open deal room";
  if (status === "ACCEPTED") return "Proposal accepted";
  if (status === "REJECTED") return "Proposal rejected";
  if (status === "WITHDRAWN") return "Proposal withdrawn";

  return "View details";
}

function getStatusLabel(status) {
  const labels = {
    PENDING: "Awaiting Client",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };

  return labels[status] || status;
}

function mapProposal(proposal) {
  return {
    id: proposal.id,
    status: proposal.status,
    statusLabel: getStatusLabel(proposal.status),

    coverLetter: proposal.coverLetter,
    bidAmount: Number(proposal.bidAmount || 0),
    bidAmountDisplay: formatCurrency(proposal.bidAmount),
    estimatedDays: proposal.estimatedDays,

    createdAt: proposal.createdAt.toISOString(),
    createdAtDisplay: formatDate(proposal.createdAt),
    updatedAt: proposal.updatedAt.toISOString(),

    nextAction: getNextAction(proposal.status, proposal.project?.status),

    project: proposal.project
      ? {
          id: proposal.project.id,
          title: proposal.project.title,
          description: proposal.project.description,
          category: proposal.project.category,
          budget: Number(proposal.project.budget || 0),
          budgetDisplay: formatCurrency(proposal.project.budget),
          deadline: proposal.project.deadline
            ? proposal.project.deadline.toISOString()
            : null,
          deadlineDisplay: formatDate(proposal.project.deadline),
          status: proposal.project.status,
        }
      : null,

    client: proposal.project?.client
      ? {
          id: proposal.project.client.id,
          name: proposal.project.client.name,
          image: proposal.project.client.image,
        }
      : null,
  };
}

export async function getFreelancerInvites(freelancerId, filters = {}) {
  const status = String(filters.status || "ALL").toUpperCase();
  const search = String(filters.search || "").trim();

  const where = {
    freelancerId,
  };

  if (status !== "ALL" && ALLOWED_PROPOSAL_STATUSES.includes(status)) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      {
        coverLetter: {
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
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        project: {
          category: {
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
    proposals,
    totalProposals,
    pendingCount,
    acceptedCount,
    rejectedCount,
    withdrawnCount,
    pendingValue,
    acceptedValue,
  ] = await Promise.all([
    prisma.proposal.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        coverLetter: true,
        bidAmount: true,
        estimatedDays: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            budget: true,
            deadline: true,
            status: true,
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

    prisma.proposal.count({
      where: {
        freelancerId,
        status: "REJECTED",
      },
    }),

    prisma.proposal.count({
      where: {
        freelancerId,
        status: "WITHDRAWN",
      },
    }),

    prisma.proposal.aggregate({
      where: {
        freelancerId,
        status: "PENDING",
      },
      _sum: {
        bidAmount: true,
      },
    }),

    prisma.proposal.aggregate({
      where: {
        freelancerId,
        status: "ACCEPTED",
      },
      _sum: {
        bidAmount: true,
      },
    }),
  ]);

  return {
    stats: {
      totalProposals,
      pendingProposals: pendingCount,
      acceptedProposals: acceptedCount,
      rejectedProposals: rejectedCount,
      withdrawnProposals: withdrawnCount,
      pendingValue: Number(pendingValue._sum.bidAmount || 0),
      pendingValueDisplay: formatCurrency(pendingValue._sum.bidAmount),
      acceptedValue: Number(acceptedValue._sum.bidAmount || 0),
      acceptedValueDisplay: formatCurrency(acceptedValue._sum.bidAmount),
    },
    proposals: proposals.map(mapProposal),
  };
}