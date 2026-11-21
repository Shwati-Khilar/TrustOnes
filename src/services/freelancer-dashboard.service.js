import { prisma } from "@/lib/prisma";

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
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

  return formatShortDate(value);
}

function mapMilestoneStatus(status) {
  const statusMap = {
    PENDING: "PENDING",
    IN_PROGRESS: "ACTIVE",
    SUBMITTED: "SUBMITTED",
    APPROVED: "APPROVED",
    REJECTED: "REVISION_REQUESTED",
  };

  return statusMap[status] || "PENDING";
}

function getNextAction(milestones) {
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

  return "Open deal room";
}

function getActivityTitle(status) {
  const titles = {
    PENDING: "Milestone created",
    IN_PROGRESS: "Milestone in progress",
    SUBMITTED: "Milestone submitted",
    APPROVED: "Submission approved",
    REJECTED: "Revision requested",
  };

  return titles[status] || "Milestone updated";
}

function getActivityType(status) {
  const types = {
    PENDING: "MILESTONE",
    IN_PROGRESS: "MILESTONE",
    SUBMITTED: "SUBMISSION",
    APPROVED: "APPROVED",
    REJECTED: "REVISION",
  };

  return types[status] || "MILESTONE";
}

export async function getFreelancerDashboard(freelancerId) {
  const [
    activeProjectsCount,
    pendingProposalsCount,
    activeMilestonesCount,
    approvedMilestonesCount,
    approvedEarnings,
    activeProjects,
    pendingProposals,
    upcomingMilestones,
    recentMilestones,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        freelancerId,
        status: "ACTIVE",
      },
    }),

    prisma.proposal.count({
      where: {
        freelancerId,
        status: "PENDING",
      },
    }),

    prisma.milestone.count({
      where: {
        status: {
          in: ["IN_PROGRESS", "SUBMITTED"],
        },
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

    prisma.project.findMany({
      where: {
        freelancerId,
        status: {
          in: ["ACTIVE", "PAUSED"],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
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
        milestones: {
          orderBy: {
            dueDate: "asc",
          },
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    }),

    prisma.proposal.findMany({
      where: {
        freelancerId,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        bidAmount: true,
        estimatedDays: true,
        status: true,
        createdAt: true,
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

    prisma.milestone.findMany({
      where: {
        dueDate: {
          gte: new Date(),
        },
        status: {
          in: ["PENDING", "IN_PROGRESS", "SUBMITTED", "REJECTED"],
        },
        project: {
          freelancerId,
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        amount: true,
        dueDate: true,
        status: true,
        project: {
          select: {
            id: true,
            title: true,
          },
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
      take: 5,
      select: {
        id: true,
        title: true,
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

  return {
    stats: {
      activeProjects: activeProjectsCount,
      pendingProposals: pendingProposalsCount,
      activeMilestones: activeMilestonesCount,
      approvedMilestones: approvedMilestonesCount,
      approvedEarnings: formatCurrency(approvedEarnings._sum.amount),
    },

    pendingProposals: pendingProposals.map((proposal) => ({
      id: proposal.id,
      title: proposal.project.title,
      client: proposal.project.client?.name || "Client",
      budget: formatCurrency(proposal.project.budget),
      deadline: formatShortDate(proposal.project.deadline),
      summary: proposal.project.description,
      status: "Awaiting Client",
    })),

    activeProjects: activeProjects.map((project) => {
      const total = project.milestones.length;
      const completed = project.milestones.filter(
        (milestone) => milestone.status === "APPROVED"
      ).length;

      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        id: project.id,
        title: project.title,
        client: project.client?.name || "Client",
        budget: formatCurrency(project.budget),
        progress,
        completed,
        total,
        next: getNextAction(project.milestones),
        status: project.status,
      };
    }),

    upcomingMilestones: upcomingMilestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      project: milestone.project.title,
      amount: formatCurrency(milestone.amount),
      due: formatDue(milestone.dueDate),
      status: mapMilestoneStatus(milestone.status),
    })),

    recentActivities: recentMilestones.map((milestone) => ({
      id: milestone.id,
      title: getActivityTitle(milestone.status),
      description: `${milestone.title} in ${milestone.project.title}.`,
      time: formatShortDate(milestone.updatedAt),
      type: getActivityType(milestone.status),
    })),
  };
}