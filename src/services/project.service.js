import { references } from "./evidence-storage";
import { prisma } from "@/lib/prisma";

import { createDraft, editListing, cancelListing } from "@/services/marketplace.service";
import { serviceResult } from "@/services/service-result";

export function createProject(id,input,files) {
  return serviceResult(async()=>({project:await createDraft(id,input,files)}),201);
}
export async function getProjectById(userId, projectId) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: userId,
      },
      include: {
        acceptedOffer: true,
        evidence:references(),

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
        },

      },
    });

    if (!project) {
      return {
        success: false,
        status: 404,
        message: "Project not found.",
      };
    }

    const counts = await prisma.proposal.groupBy({
      by: ["kind", "status"], where: { projectId, project: { clientId: userId } }, _count: true,
    });
    const offerActivity = { proposals: 0, invitations: 0, pending: 0 };
    for (const row of counts) {
      offerActivity[row.kind === "INVITATION" ? "invitations" : "proposals"] += row._count;
      if (row.status === "PENDING") offerActivity.pending += row._count;
    }

    return {
      success: true,
      status: 200,
      project: {
        ...project,
        offerActivity,
        budget: project.budget.toString(),
        milestones: project.milestones.map((m) => ({
          ...m,
          amount: m.amount.toString(),
        })),
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
export function updateProject(id,projectId,input,files) {
  return serviceResult(async()=>({project:await editListing(id,projectId,input,files)}));
}
export function cancelProject(id,projectId) {
  return serviceResult(async()=>({project:await cancelListing(id,projectId)}));
}
export async function getClientProjects(userId) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        clientId: userId,
      },

      include: {
        _count: { select: { proposals: { where: {status: "PENDING"} } } },
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
            amount: true,
            dueDate: true,
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
        (m) => m.status === "APPROVED"
      );

      const totalMilestones = project.milestones.length;

      const completedCount = completedMilestones.length;

      const progress =
        totalMilestones === 0
          ? 0
          : Math.round((completedCount / totalMilestones) * 100);

      const spent = completedMilestones.reduce(
        (sum, m) => sum + Number(m.amount),
        0
      );

      const remainingBudget =
        Number(project.budget) - spent;

      const nextMilestone = project.milestones.find(
        (m) => m.status === "PENDING"
      );

      return {
        ...project,

        budget: project.budget.toString(),

        milestones: project.milestones.map((m) => ({
          ...m,
          amount: m.amount.toString(),
        })),

        totalMilestones,

        completedMilestones: completedCount,

        progress,

        spent: spent.toString(),

remainingBudget: remainingBudget.toString(),

        nextMilestone: nextMilestone
  ? {
      ...nextMilestone,
      amount: nextMilestone.amount.toString(),
    }
  : null,
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

