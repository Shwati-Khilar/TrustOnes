import { projectDate, formatCurrency } from "@/lib/project-presentation";
import { prisma } from "@/lib/prisma";

const ALLOWED_PROPOSAL_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
  "CLOSED",
];

function formatDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getNextAction(status, projectStatus) {
  if (status === "PENDING") return "View current offer";
  if (status === "ACCEPTED" && projectStatus === "ACTIVE") return "Open deal room";
  if (status === "ACCEPTED") return "Proposal accepted";
  if (status === "REJECTED") return "Proposal rejected";
  if (status === "WITHDRAWN") return "Proposal withdrawn";

  return "View details";
}

function getStatusLabel(status) {
  const labels = {
    PENDING: "Open negotiation",
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
          budget: Number(proposal.project.advertisedBudget ?? proposal.project.budget),
          budgetDisplay: formatCurrency(proposal.project.advertisedBudget ?? proposal.project.budget),
          deadline: (proposal.project.advertisedDeadline ?? proposal.project.deadline)
            ? (proposal.project.advertisedDeadline ?? proposal.project.deadline).toISOString()
            : null,
          deadlineDisplay: projectDate(proposal.project.advertisedDeadline ?? proposal.project.deadline),
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

export async function getFreelancerProposalSummary(freelancerId, filters = {}) {
  const status = String(filters.status || "ALL").toUpperCase();
  const search = String(filters.search || "").trim();

  const where = {
    kind: "PROPOSAL", freelancerId,
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
      skip: (filters.page - 1) * 24,
      take: 24,
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
            advertisedBudget: true,
            advertisedDeadline: true,
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
        kind: "PROPOSAL", freelancerId,
      },
    }),

    prisma.proposal.count({
      where: {
        kind: "PROPOSAL", freelancerId,
        status: "PENDING",
      },
    }),

    prisma.proposal.count({
      where: {
        kind: "PROPOSAL", freelancerId,
        status: "ACCEPTED",
      },
    }),

    prisma.proposal.count({
      where: {
        kind: "PROPOSAL", freelancerId,
        status: "REJECTED",
      },
    }),

    prisma.proposal.count({
      where: {
        kind: "PROPOSAL", freelancerId,
        status: "WITHDRAWN",
      },
    }),

    prisma.$queryRaw`SELECT COALESCE(SUM(o.amount),0) AS total
      FROM proposals p JOIN offer_revisions o ON o."negotiationId"=p.id AND o.version=p.version
      WHERE p."freelancerId"=${freelancerId} AND p.kind='PROPOSAL' AND p.status='PENDING'`,
    prisma.offerRevision.aggregate({
      where: { negotiation: { kind: "PROPOSAL", freelancerId, status: "ACCEPTED" }, assignedProject: { isNot: null } },
      _sum: { amount: true },
    }),
  ]);

  return {
    stats: {
      totalProposals,
      pendingProposals: pendingCount,
      acceptedProposals: acceptedCount,
      rejectedProposals: rejectedCount,
      withdrawnProposals: withdrawnCount,
      pendingValue: Number(pendingValue[0].total || 0),
      pendingValueDisplay: formatCurrency(pendingValue[0].total),
      acceptedValue: Number(acceptedValue._sum.amount || 0),
      acceptedValueDisplay: formatCurrency(acceptedValue._sum.amount),
    },
    proposals: proposals.map(mapProposal),
  };
}