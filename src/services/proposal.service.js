import { prisma } from "@/lib/prisma";

export async function createProposal(userId, projectId, data) {
  const coverLetter = String(data.coverLetter || "").trim();
  const bidAmount = Number(data.bidAmount);
  const estimatedDays = Number(data.estimatedDays);

  if (!coverLetter || !data.bidAmount || !data.estimatedDays) {
    return {
      success: false,
      status: 400,
      message: "All proposal fields are required.",
    };
  }

  if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
    return {
      success: false,
      status: 400,
      message: "Bid amount must be greater than 0.",
    };
  }

  if (
    !Number.isInteger(estimatedDays) ||
    estimatedDays <= 0
  ) {
    return {
      success: false,
      status: 400,
      message: "Estimated days must be a positive whole number.",
    };
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        clientId: true,
        status: true,
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
        message: "Proposals can only be submitted to open projects.",
      };
    }

    if (project.clientId === userId) {
      return {
        success: false,
        status: 403,
        message: "You cannot submit a proposal to your own project.",
      };
    }

    const existingProposal = await prisma.proposal.findUnique({
      where: {
        projectId_freelancerId: {
          projectId,
          freelancerId: userId,
        },
      },
    });

    if (existingProposal) {
      return {
        success: false,
        status: 409,
        message: "You have already submitted a proposal to this project.",
      };
    }

    const proposal = await prisma.proposal.create({
      data: {
        coverLetter,
        bidAmount,
        estimatedDays,
        projectId,
        freelancerId: userId,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Proposal submitted successfully.",
      proposal: {
        ...proposal,
        bidAmount: proposal.bidAmount.toString(),
      },
    };
  } catch (error) {
    console.error("CREATE_PROPOSAL_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to submit proposal.",
    };
  }
}

export async function getProjectProposals(clientId, projectId) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return {
        success: false,
        status: 404,
        message: "Project not found.",
      };
    }

    const proposals = await prisma.proposal.findMany({
      where: {
        projectId,
      },

      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedProposals = proposals.map((proposal) => ({
      ...proposal,
      bidAmount: proposal.bidAmount.toString(),
    }));

    return {
      success: true,
      status: 200,
      proposals: formattedProposals,
    };
  } catch (error) {
    console.error("GET_PROJECT_PROPOSALS_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to fetch project proposals.",
    };
  }
}

export async function acceptProposal(clientId, proposalId) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find proposal and its project
      const proposal = await tx.proposal.findUnique({
        where: {
          id: proposalId,
        },
        include: {
          project: true,
        },
      });

      if (!proposal) {
        throw new Error("PROPOSAL_NOT_FOUND");
      }

      // 2. Security: project must belong to logged-in client
      if (proposal.project.clientId !== clientId) {
        throw new Error("FORBIDDEN");
      }

      // 3. Only OPEN projects can accept proposals
      if (proposal.project.status !== "OPEN") {
        throw new Error("PROJECT_NOT_OPEN");
      }

      // 4. Proposal itself must still be pending
      if (proposal.status !== "PENDING") {
        throw new Error("PROPOSAL_NOT_PENDING");
      }

      // 5. Accept selected proposal
      const acceptedProposal = await tx.proposal.update({
        where: {
          id: proposalId,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      // 6. Reject every other pending proposal
      await tx.proposal.updateMany({
        where: {
          projectId: proposal.projectId,

          id: {
            not: proposalId,
          },

          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      });

      // 7. Activate project and assign freelancer
      const updatedProject = await tx.project.update({
        where: {
          id: proposal.projectId,
        },
        data: {
          status: "ACTIVE",
          freelancerId: proposal.freelancerId,
        },
      });

      return {
        acceptedProposal,
        updatedProject,
      };
    });

    return {
      success: true,
      status: 200,
      message: "Proposal accepted successfully.",
      proposal: {
        ...result.acceptedProposal,
        bidAmount: result.acceptedProposal.bidAmount.toString(),
      },
      project: {
        ...result.updatedProject,
        budget: result.updatedProject.budget.toString(),
      },
    };
  } catch (error) {
    if (error.message === "PROPOSAL_NOT_FOUND") {
      return {
        success: false,
        status: 404,
        message: "Proposal not found.",
      };
    }

    if (error.message === "FORBIDDEN") {
      return {
        success: false,
        status: 403,
        message: "You are not allowed to accept this proposal.",
      };
    }

    if (error.message === "PROJECT_NOT_OPEN") {
      return {
        success: false,
        status: 400,
        message: "Proposals can only be accepted for open projects.",
      };
    }

    if (error.message === "PROPOSAL_NOT_PENDING") {
      return {
        success: false,
        status: 409,
        message: "This proposal is no longer pending.",
      };
    }

    console.error("ACCEPT_PROPOSAL_SERVICE_ERROR", error);

    return {
      success: false,
      status: 500,
      message: "Unable to accept proposal.",
    };
  }
}