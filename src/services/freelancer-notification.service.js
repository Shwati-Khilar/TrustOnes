import { prisma } from "@/lib/prisma";

function formatDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatRelativeTime(value) {
  if (!value) return "No date";

  const now = new Date();
  const date = new Date(value);
  const diffMs = now - date;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hour(s) ago`;
  if (diffMs < day * 7) return `${Math.floor(diffMs / day)} day(s) ago`;

  return formatDate(value);
}

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildProposalNotification(proposal) {
  const projectTitle = proposal.project?.title || "Project";
  const clientName = proposal.project?.client?.name || "Client";

  const statusConfig = {
    PENDING: {
      title: "Proposal awaiting client response",
      message: `Your proposal for ${projectTitle} is waiting for ${clientName}'s response.`,
      category: "PROPOSAL",
      priority: "MEDIUM",
      actionRequired: false,
      actionLabel: "View Proposal",
      actionUrl: "/freelancer/invites",
    },
    ACCEPTED: {
      title: "Proposal accepted",
      message: `${clientName} accepted your proposal for ${projectTitle}. The project can now continue in deal room.`,
      category: "PROPOSAL",
      priority: "HIGH",
      actionRequired: true,
      actionLabel: "Open Deal Room",
      actionUrl: `/freelancer/deal-rooms/${proposal.project?.id}`,
    },
    REJECTED: {
      title: "Proposal rejected",
      message: `${clientName} rejected your proposal for ${projectTitle}.`,
      category: "PROPOSAL",
      priority: "LOW",
      actionRequired: false,
      actionLabel: "View Proposal",
      actionUrl: "/freelancer/invites",
    },
    WITHDRAWN: {
      title: "Proposal withdrawn",
      message: `Your proposal for ${projectTitle} was withdrawn.`,
      category: "PROPOSAL",
      priority: "LOW",
      actionRequired: false,
      actionLabel: "View Proposal",
      actionUrl: "/freelancer/invites",
    },
  };

  const config = statusConfig[proposal.status] || statusConfig.PENDING;

  return {
    id: `proposal-${proposal.id}`,
    sourceId: proposal.id,
    sourceType: "PROPOSAL",
    title: config.title,
    message: config.message,
    category: config.category,
    priority: config.priority,
    status: proposal.status,
    actionRequired: config.actionRequired,
    actionLabel: config.actionLabel,
    actionUrl: config.actionUrl,
    amountDisplay: formatCurrency(proposal.bidAmount),
    createdAt: proposal.updatedAt.toISOString(),
    createdAtDisplay: formatDate(proposal.updatedAt),
    relativeTime: formatRelativeTime(proposal.updatedAt),
    isRead: false,
  };
}

function buildMilestoneNotification(milestone) {
  const projectTitle = milestone.project?.title || "Project";
  const clientName = milestone.project?.client?.name || "Client";

  const statusConfig = {
    PENDING: {
      title: "Milestone created",
      message: `${milestone.title} has been added under ${projectTitle}.`,
      priority: "LOW",
      actionRequired: false,
      actionLabel: "View Milestone",
      actionUrl: "/freelancer/milestones",
    },
    IN_PROGRESS: {
      title: "Milestone ready for work",
      message: `${milestone.title} is in progress. You can prepare and submit work.`,
      priority: "HIGH",
      actionRequired: true,
      actionLabel: "Submit Work",
      actionUrl: `/freelancer/deal-rooms/${milestone.project?.id}`,
    },
    SUBMITTED: {
      title: "Work submitted",
      message: `${milestone.title} has been submitted and is waiting for ${clientName}'s approval.`,
      priority: "MEDIUM",
      actionRequired: false,
      actionLabel: "View Submission",
      actionUrl: `/freelancer/deal-rooms/${milestone.project?.id}`,
    },
    APPROVED: {
      title: "Milestone approved",
      message: `${milestone.title} was approved. ${formatCurrency(
        milestone.amount
      )} is now counted in approved earnings.`,
      priority: "MEDIUM",
      actionRequired: false,
      actionLabel: "Open Wallet",
      actionUrl: "/freelancer/wallet",
    },
    REJECTED: {
      title: "Revision requested",
      message: `${clientName} requested revision for ${milestone.title}.`,
      priority: "HIGH",
      actionRequired: true,
      actionLabel: "Revise Work",
      actionUrl: `/freelancer/deal-rooms/${milestone.project?.id}`,
    },
  };

  const config = statusConfig[milestone.status] || statusConfig.PENDING;

  return {
    id: `milestone-${milestone.id}`,
    sourceId: milestone.id,
    sourceType: "MILESTONE",
    title: config.title,
    message: config.message,
    category: "MILESTONE",
    priority: config.priority,
    status: milestone.status,
    actionRequired: config.actionRequired,
    actionLabel: config.actionLabel,
    actionUrl: config.actionUrl,
    amountDisplay: formatCurrency(milestone.amount),
    createdAt: milestone.updatedAt.toISOString(),
    createdAtDisplay: formatDate(milestone.updatedAt),
    relativeTime: formatRelativeTime(milestone.updatedAt),
    isRead: false,
  };
}

function buildProjectNotification(project) {
  const clientName = project.client?.name || "Client";

  return {
    id: `project-${project.id}`,
    sourceId: project.id,
    sourceType: "PROJECT",
    title: "Active deal room",
    message: `${project.title} with ${clientName} is active and available in your deal rooms.`,
    category: "PROJECT",
    priority: "LOW",
    status: project.status,
    actionRequired: false,
    actionLabel: "Open Deal Room",
    actionUrl: `/freelancer/deal-rooms/${project.id}`,
    amountDisplay: formatCurrency(project.budget),
    createdAt: project.updatedAt.toISOString(),
    createdAtDisplay: formatDate(project.updatedAt),
    relativeTime: formatRelativeTime(project.updatedAt),
    isRead: false,
  };
}

function applyFilter(notifications, filters = {}) {
  const type = String(filters.type || "ALL").toUpperCase();
  const priority = String(filters.priority || "ALL").toUpperCase();
  const actionRequired = String(filters.actionRequired || "ALL").toUpperCase();

  return notifications.filter((notification) => {
    const matchesType = type === "ALL" || notification.category === type;
    const matchesPriority =
      priority === "ALL" || notification.priority === priority;
    const matchesAction =
      actionRequired === "ALL" ||
      (actionRequired === "TRUE" && notification.actionRequired) ||
      (actionRequired === "FALSE" && !notification.actionRequired);

    return matchesType && matchesPriority && matchesAction;
  });
}

export async function getFreelancerNotifications(freelancerId, filters = {}) {
  const [proposals, milestones, projects] = await Promise.all([
    prisma.proposal.findMany({
      where: {
        freelancerId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 20,
      select: {
        id: true,
        bidAmount: true,
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

    prisma.milestone.findMany({
      where: {
        project: {
          freelancerId,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 25,
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

    prisma.project.findMany({
      where: {
        freelancerId,
        status: "ACTIVE",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        title: true,
        budget: true,
        status: true,
        updatedAt: true,
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  const allNotifications = [
    ...proposals.map(buildProposalNotification),
    ...milestones.map(buildMilestoneNotification),
    ...projects.map(buildProjectNotification),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredNotifications = applyFilter(allNotifications, filters);

  const actionRequiredCount = allNotifications.filter(
    (item) => item.actionRequired
  ).length;

  const highPriorityCount = allNotifications.filter(
    (item) => item.priority === "HIGH"
  ).length;

  const proposalCount = allNotifications.filter(
    (item) => item.category === "PROPOSAL"
  ).length;

  const milestoneCount = allNotifications.filter(
    (item) => item.category === "MILESTONE"
  ).length;

  return {
    stats: {
      totalNotifications: allNotifications.length,
      unreadNotifications: allNotifications.length,
      actionRequiredNotifications: actionRequiredCount,
      highPriorityNotifications: highPriorityCount,
      proposalNotifications: proposalCount,
      milestoneNotifications: milestoneCount,
    },
    notifications: filteredNotifications.slice(0, 50),
  };
}