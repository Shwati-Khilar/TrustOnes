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