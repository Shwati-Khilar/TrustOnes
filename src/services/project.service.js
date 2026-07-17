import { prisma } from "@/lib/prisma";

export async function createProject(userId, data) {
  const title = String(data.title || "").trim();
  const description = String(data.description || "").trim();
  const category = String(data.category || "").trim();
  const budget = Number(data.budget);
  const deadline = new Date(data.deadline);

  if (!title || !description || !category || !data.budget || !data.deadline) {
    return {
      success: false,
      status: 400,
      message: "All project fields are required.",
    };
  }

  if (!Number.isFinite(budget) || budget <= 0) {
    return {
      success: false,
      status: 400,
      message: "Budget must be greater than 0.",
    };
  }

  if (Number.isNaN(deadline.getTime())) {
    return {
      success: false,
      status: 400,
      message: "Invalid project deadline.",
    };
  }

  if (deadline <= new Date()) {
    return {
      success: false,
      status: 400,
      message: "Project deadline must be in the future.",
    };
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        category,
        budget,
        deadline,
        clientId: userId,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Project created successfully.",
      project: {
        ...project,
        budget: project.budget.toString(),
      },
    };
  } catch (error) {
    console.error("CREATE_PROJECT_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to create project.",
    };
  }
}
export async function getProjectById(userId, projectId) {
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

    return {
      success: true,
      status: 200,
      project: {
        ...project,
        budget: project.budget.toString(),
      },
    };
  } catch (error) {
    console.error("GET_PROJECT_BY_ID_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to fetch project.",
    };
  }
}
export async function updateProject(userId, projectId, data) {
  const title = String(data.title || "").trim();
  const description = String(data.description || "").trim();
  const category = String(data.category || "").trim();
  const budget = Number(data.budget);
  const deadline = new Date(data.deadline);

  if (
    !title ||
    !description ||
    !category ||
    !data.budget ||
    !data.deadline
  ) {
    return {
      success: false,
      status: 400,
      message: "All project fields are required.",
    };
  }

  if (!Number.isFinite(budget) || budget <= 0) {
    return {
      success: false,
      status: 400,
      message: "Budget must be greater than 0.",
    };
  }

  if (Number.isNaN(deadline.getTime())) {
    return {
      success: false,
      status: 400,
      message: "Invalid project deadline.",
    };
  }

  if (deadline <= new Date()) {
    return {
      success: false,
      status: 400,
      message: "Project deadline must be in the future.",
    };
  }

  try {
    // Ownership check.
    // A client must only be able to update their own project.
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: userId,
      },
    });

    if (!existingProject) {
      return {
        success: false,
        status: 404,
        message: "Project not found.",
      };
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },

      data: {
        title,
        description,
        category,
        budget,
        deadline,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Project updated successfully.",
      project: {
        ...updatedProject,
        budget: updatedProject.budget.toString(),
      },
    };
  } catch (error) {
    console.error("UPDATE_PROJECT_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to update project.",
    };
  }
}
export async function cancelProject(userId, projectId) {
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

    if (project.status !== "OPEN") {
      return {
        success: false,
        status: 400,
        message: "Only open projects can be cancelled.",
      };
    }

    const cancelledProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return {
      success: true,
      status: 200,
      message: "Project cancelled successfully.",
      project: {
        ...cancelledProject,
        budget: cancelledProject.budget.toString(),
      },
    };
  } catch (error) {
    console.error("CANCEL_PROJECT_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to cancel project.",
    };
  }
}

export async function getClientProjects(userId) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        clientId: userId,
      },

      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },

        milestones: {
          orderBy: {
            createdAt: "asc",
          },

          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedProjects = projects.map((project) => {
      const completedMilestones = project.milestones.filter(
        (milestone) => milestone.status === "COMPLETED"
      ).length;

      return {
        ...project,

        budget: project.budget.toString(),

        totalMilestones: project.milestones.length,

        completedMilestones,
      };
    });

    return {
      success: true,
      status: 200,
      projects: formattedProjects,
    };
  } catch (error) {
    console.error("GET_CLIENT_PROJECTS_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to fetch projects.",
    };
  }
}

