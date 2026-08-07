import { prisma } from "@/lib/prisma";

export async function createMilestone(userId, projectId, data) {
  const title = String(data.title || "").trim();
  const description = String(data.description || "").trim();
  const amount = Number(data.amount);
  const dueDate = new Date(data.dueDate);

  if (!title || !data.amount || !data.dueDate) {
    return {
      success: false,
      status: 400,
      message: "Title, amount and due date are required.",
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      status: 400,
      message: "Milestone amount must be greater than 0.",
    };
  }

  if (Number.isNaN(dueDate.getTime())) {
    return {
      success: false,
      status: 400,
      message: "Invalid milestone due date.",
    };
  }

  if (dueDate <= new Date()) {
    return {
      success: false,
      status: 400,
      message: "Milestone due date must be in the future.",
    };
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: userId,
      },

      select: {
        id: true,
        status: true,
        budget: true,
        deadline: true,
      },
    });

    if (!project) {
      return {
        success: false,
        status: 404,
        message: "Project not found.",
      };
    }

    if (project.status !== "ACTIVE") {
      return {
        success: false,
        status: 400,
        message: "Milestones can only be created for active projects.",
      };
    }

    if (dueDate > project.deadline) {
      return {
        success: false,
        status: 400,
        message: "Milestone due date cannot exceed the project deadline.",
      };
    }

    const milestoneAmount = await prisma.milestone.aggregate({
      where: {
        projectId,
      },

      _sum: {
        amount: true,
      },
    });

    const allocatedAmount = Number(
      milestoneAmount._sum.amount || 0
    );

    const projectBudget = Number(project.budget);

    if (allocatedAmount + amount > projectBudget) {
      return {
        success: false,
        status: 400,
        message:
          "Total milestone amount cannot exceed the project budget.",
      };
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        description: description || null,
        amount,
        dueDate,
        projectId,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Milestone created successfully.",
      milestone: {
        ...milestone,
        amount: milestone.amount.toString(),
      },
    };
  } catch (error) {
    console.error("CREATE_MILESTONE_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to create milestone.",
    };
  }
}

export async function getProjectMilestones(userId, projectId) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: userId,
      },
    });

    if (!project) {
      return {
        success: false,
        status: 404,
        message: "Project not found.",
      };
    }

    const milestones = await prisma.milestone.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      status: 200,
      milestones: milestones.map((milestone) => ({
        ...milestone,
        amount: milestone.amount.toString(),
      })),
    };
  } catch (error) {
    console.error("GET_PROJECT_MILESTONES_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to fetch milestones.",
    };
  }
}
export async function updateMilestone(userId, milestoneId, data) {
  const title = String(data.title || "").trim();
  const description = String(data.description || "").trim();
  const amount = Number(data.amount);
  const dueDate = new Date(data.dueDate);

  if (!title || !data.amount || !data.dueDate) {
    return {
      success: false,
      status: 400,
      message: "Title, amount and due date are required.",
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      status: 400,
      message: "Milestone amount must be greater than 0.",
    };
  }

  if (Number.isNaN(dueDate.getTime())) {
    return {
      success: false,
      status: 400,
      message: "Invalid milestone due date.",
    };
  }

  try {
    const milestone = await prisma.milestone.findUnique({
      where: {
        id: milestoneId,
      },
      include: {
        project: true,
      },
    });

    if (!milestone) {
      return {
        success: false,
        status: 404,
        message: "Milestone not found.",
      };
    }

    if (milestone.project.clientId !== userId) {
      return {
        success: false,
        status: 403,
        message: "You are not allowed to edit this milestone.",
      };
    }

    if (
      milestone.project.status === "COMPLETED" ||
      milestone.project.status === "CANCELLED"
    ) {
      return {
        success: false,
        status: 400,
        message: "Project can no longer be modified.",
      };
    }

    const aggregate = await prisma.milestone.aggregate({
      where: {
        projectId: milestone.projectId,
        id: {
          not: milestoneId,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const allocated = Number(
      aggregate._sum.amount || 0
    );

    const budget = Number(
      milestone.project.budget
    );

    if (allocated + amount > budget) {
      return {
        success: false,
        status: 400,
        message:
          "Total milestone amount cannot exceed project budget.",
      };
    }

    const updated = await prisma.milestone.update({
      where: {
        id: milestoneId,
      },
      data: {
        title,
        description: description || null,
        amount,
        dueDate,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Milestone updated successfully.",
      milestone: {
        ...updated,
        amount: updated.amount.toString(),
      },
    };
  } catch (error) {
    console.error("UPDATE_MILESTONE_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to update milestone.",
    };
  }
}
export async function deleteMilestone(userId, milestoneId) {
  try {
    const milestone = await prisma.milestone.findUnique({
      where: {
        id: milestoneId,
      },
      include: {
        project: true,
      },
    });

    if (!milestone) {
      return {
        success: false,
        status: 404,
        message: "Milestone not found.",
      };
    }

    if (milestone.project.clientId !== userId) {
      return {
        success: false,
        status: 403,
        message: "You are not allowed to delete this milestone.",
      };
    }

    if (
      milestone.project.status === "COMPLETED" ||
      milestone.project.status === "CANCELLED"
    ) {
      return {
        success: false,
        status: 400,
        message: "Project can no longer be modified.",
      };
    }

    await prisma.milestone.delete({
      where: {
        id: milestoneId,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Milestone deleted successfully.",
    };
  } catch (error) {
    console.error("DELETE_MILESTONE_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to delete milestone.",
    };
  }
}