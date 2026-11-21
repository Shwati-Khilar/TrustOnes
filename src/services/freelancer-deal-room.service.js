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
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatShortDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function getDealRoomHealth(project) {
  const milestones = project.milestones || [];

  const rejected = milestones.some((milestone) => milestone.status === "REJECTED");
  if (rejected) return "NEEDS_ATTENTION";

  const submitted = milestones.some((milestone) => milestone.status === "SUBMITTED");
  if (submitted) return "WAITING_CLIENT";

  const inProgress = milestones.some(
    (milestone) => milestone.status === "IN_PROGRESS"
  );
  if (inProgress) return "ACTIVE_WORK";

  if (project.status === "COMPLETED") return "COMPLETED";
  if (project.status === "PAUSED") return "PAUSED";
  if (project.status === "CANCELLED") return "CANCELLED";

  return "READY";
}

function getNextAction(project) {
  const milestones = project.milestones || [];

  const rejected = milestones.find((milestone) => milestone.status === "REJECTED");
  if (rejected) return `Revise ${rejected.title}`;

  const inProgress = milestones.find(
    (milestone) => milestone.status === "IN_PROGRESS"
  );
  if (inProgress) return `Submit ${inProgress.title}`;

  const submitted = milestones.find(
    (milestone) => milestone.status === "SUBMITTED"
  );
  if (submitted) return `Waiting for approval: ${submitted.title}`;

  const pending = milestones.find((milestone) => milestone.status === "PENDING");
  if (pending) return `Start ${pending.title}`;

  if (project.status === "COMPLETED") return "Project completed";
  if (project.status === "PAUSED") return "Project paused";
  if (project.status === "CANCELLED") return "Project cancelled";

  return "Open deal room";
}

function calculateMilestoneSummary(milestones) {
  const total = milestones.length;
  const approved = milestones.filter(
    (milestone) => milestone.status === "APPROVED"
  ).length;

  const pending = milestones.filter(
    (milestone) => milestone.status === "PENDING"
  ).length;

  const inProgress = milestones.filter(
    (milestone) => milestone.status === "IN_PROGRESS"
  ).length;

  const submitted = milestones.filter(
    (milestone) => milestone.status === "SUBMITTED"
  ).length;

  const rejected = milestones.filter(
    (milestone) => milestone.status === "REJECTED"
  ).length;

  const progress = total === 0 ? 0 : Math.round((approved / total) * 100);

  const approvedAmount = milestones.reduce((sum, milestone) => {
    if (milestone.status === "APPROVED") {
      return sum + Number(milestone.amount || 0);
    }

    return sum;
  }, 0);

  const activeAmount = milestones.reduce((sum, milestone) => {
    if (
      milestone.status === "IN_PROGRESS" ||
      milestone.status === "SUBMITTED"
    ) {
      return sum + Number(milestone.amount || 0);
    }

    return sum;
  }, 0);

  return {
    total,
    approved,
    pending,
    inProgress,
    submitted,
    rejected,
    progress,
    approvedAmount,
    approvedAmountDisplay: formatCurrency(approvedAmount),
    activeAmount,
    activeAmountDisplay: formatCurrency(activeAmount),
  };
}

function mapDealRoom(project) {
  const milestoneSummary = calculateMilestoneSummary(project.milestones || []);
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
    deadlineShortDisplay: formatShortDate(project.deadline),

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

    milestoneSummary,
    health: getDealRoomHealth(project),
    nextAction: getNextAction(project),

    milestones: (project.milestones || []).map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      amount: Number(milestone.amount || 0),
      amountDisplay: formatCurrency(milestone.amount),
      dueDate: milestone.dueDate ? milestone.dueDate.toISOString() : null,
      dueDateDisplay: formatDate(milestone.dueDate),
      status: milestone.status,
    })),

    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export async function getFreelancerDealRooms(freelancerId, filters = {}) {
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

  const [
    dealRooms,
    totalDealRooms,
    activeDealRooms,
    pausedDealRooms,
    completedDealRooms,
    actionRequiredMilestones,
    submittedMilestones,
    approvedAmount,
  ] = await Promise.all([
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
            status: "ACCEPTED",
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

    prisma.milestone.count({
      where: {
        status: {
          in: ["IN_PROGRESS", "REJECTED"],
        },
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
    stats: {
      totalDealRooms,
      activeDealRooms,
      pausedDealRooms,
      completedDealRooms,
      actionRequiredMilestones,
      submittedMilestones,
      approvedAmount: Number(approvedAmount._sum.amount || 0),
      approvedAmountDisplay: formatCurrency(approvedAmount._sum.amount),
    },
    dealRooms: dealRooms.map(mapDealRoom),
  };
}

function mapDetailMilestoneStatus(status) {
  if (status === "REJECTED") return "REVISION_REQUESTED";
  return status;
}

function getMilestoneActivityTitle(status) {
  const titles = {
    PENDING: "Milestone created",
    IN_PROGRESS: "Milestone in progress",
    SUBMITTED: "Work submitted",
    APPROVED: "Milestone approved",
    REJECTED: "Revision requested",
  };

  return titles[status] || "Milestone updated";
}

function getMilestoneActivityType(status) {
  const types = {
    PENDING: "MILESTONE",
    IN_PROGRESS: "MILESTONE",
    SUBMITTED: "SUBMISSION",
    APPROVED: "APPROVED",
    REJECTED: "REVISION",
  };

  return types[status] || "MILESTONE";
}

function buildDealRoomTimeline(project) {
  const events = [];

  events.push({
    id: `project-${project.id}`,
    title: "Project assigned",
    text: `${project.title} was assigned to you.`,
    time: formatDate(project.createdAt),
    type: "PROJECT",
    createdAt: project.createdAt.toISOString(),
  });

  const acceptedProposal = project.proposals?.[0] || null;

  if (acceptedProposal) {
    events.push({
      id: `proposal-${acceptedProposal.id}`,
      title: "Proposal accepted",
      text: `Your proposal of ${formatCurrency(
        acceptedProposal.bidAmount
      )} was accepted by the client.`,
      time: formatDate(acceptedProposal.updatedAt),
      type: "PROPOSAL",
      createdAt: acceptedProposal.updatedAt.toISOString(),
    });
  }

  for (const milestone of project.milestones || []) {
    events.push({
      id: `milestone-${milestone.id}`,
      title: getMilestoneActivityTitle(milestone.status),
      text: `${milestone.title} is currently ${mapDetailMilestoneStatus(
        milestone.status
      )
        .split("_")
        .join(" ")
        .toLowerCase()}.`,
      time: formatDate(milestone.updatedAt),
      type: getMilestoneActivityType(milestone.status),
      createdAt: milestone.updatedAt.toISOString(),
    });
  }

  return events
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
}

export async function getFreelancerDealRoomDetail(freelancerId, projectId) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      freelancerId,
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
          status: "ACCEPTED",
        },
        take: 1,
        select: {
          id: true,
          coverLetter: true,
          bidAmount: true,
          estimatedDays: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      milestones: {
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
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const acceptedProposal = project.proposals?.[0] || null;
  const dealRoom = mapDealRoom(project);

  return {
    dealRoom: {
      ...dealRoom,
      summary: project.description,
      terms:
        acceptedProposal?.coverLetter ||
        "No accepted proposal note is available for this deal room.",
      deliverables:
        project.milestones.length > 0
          ? project.milestones.map((milestone) => milestone.title)
          : ["Milestones have not been added yet."],
      milestones: project.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description:
          milestone.description || "No milestone description available.",
        amount: Number(milestone.amount || 0),
        amountDisplay: formatCurrency(milestone.amount),
        dueDate: milestone.dueDate ? milestone.dueDate.toISOString() : null,
        dueDateDisplay: formatDate(milestone.dueDate),
        dueDateShortDisplay: formatShortDate(milestone.dueDate),
        status: mapDetailMilestoneStatus(milestone.status),
        rawStatus: milestone.status,
        createdAt: milestone.createdAt.toISOString(),
        updatedAt: milestone.updatedAt.toISOString(),
      })),
    },
    timeline: buildDealRoomTimeline(project),
    messages: [],
  };
}