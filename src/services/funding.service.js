import { prisma } from "@/lib/prisma";

export async function fundMilestone(clientId, milestoneId) {
  try {
    const result = await prisma.$transaction(async (tx) => {

      // Find milestone
      const milestone = await tx.milestone.findUnique({
        where: {
          id: milestoneId,
        },

        include: {
          project: true,
        },
      });

      if (!milestone) {
        throw new Error("MILESTONE_NOT_FOUND");
      }

      // Security check
      if (milestone.project.clientId !== clientId) {
        throw new Error("FORBIDDEN");
      }

      // Project must be active
      if (milestone.project.status !== "ACTIVE") {
        throw new Error("PROJECT_NOT_ACTIVE");
      }
      

      // Milestone must still be pending
      if (milestone.status !== "PENDING") {
        throw new Error("INVALID_MILESTONE_STATUS");
      }

      // Freelancer must exist
      if (!milestone.project.freelancerId) {
        throw new Error("NO_FREELANCER_ASSIGNED");
      }

      // Funding must not already exist
      const existingFunding =
        await tx.milestoneFunding.findUnique({
          where: {
            milestoneId,
          },
        });

      if (existingFunding) {
        throw new Error("ALREADY_FUNDED");
      }

      const amount = Number(milestone.amount);

      const platformFee = Number(
        (amount * 0.10).toFixed(2)
      );

      const freelancerReceivable =
        amount - platformFee;

      // Create escrow record
      const funding =
        await tx.milestoneFunding.create({
          data: {
            milestoneId,

            clientId,

            freelancerId:
              milestone.project.freelancerId,

            amount,

            platformFee,

            freelancerReceivable,

            status: "FUNDED_LOCKED",

            fundedAt: new Date(),
          },
        });

      // Create payment record
      const payment =
        await tx.paymentTransaction.create({
          data: {
            milestoneFundingId: funding.id,

            clientId,

            amount,

            provider: "RAZORPAY_TEST",

            status: "CREATED",
          },
        });

      // Move milestone forward
      const updatedMilestone =
        await tx.milestone.update({
          where: {
            id: milestoneId,
          },
          data: {
            status: "IN_PROGRESS",
          },
        });

      return {
        funding,
        payment,
        milestone: updatedMilestone,
      };
    });

    return {
      success: true,
      status: 200,
      message: "Milestone funded successfully.",

      funding: {
        ...result.funding,
        amount: result.funding.amount.toString(),
        platformFee:
          result.funding.platformFee.toString(),
        freelancerReceivable:
          result.funding.freelancerReceivable.toString(),
      },

      payment: {
        ...result.payment,
        amount: result.payment.amount.toString(),
      },

      milestone: {
        ...result.milestone,
        amount: result.milestone.amount.toString(),
      },
    };
  } catch (error) {

    if (error.message === "MILESTONE_NOT_FOUND") {
      return {
        success: false,
        status: 404,
        message: "Milestone not found.",
      };
    }

    if (error.message === "FORBIDDEN") {
      return {
        success: false,
        status: 403,
        message: "You are not allowed to fund this milestone.",
      };
    }

    if (error.message === "PROJECT_NOT_ACTIVE") {
      return {
        success: false,
        status: 400,
        message: "Project must be active.",
      };
    }

    if (error.message === "INVALID_MILESTONE_STATUS") {
      return {
        success: false,
        status: 400,
        message: "Only pending milestones can be funded.",
      };
    }

    if (error.message === "NO_FREELANCER_ASSIGNED") {
      return {
        success: false,
        status: 400,
        message: "No freelancer has been assigned.",
      };
    }

    if (error.message === "ALREADY_FUNDED") {
      return {
        success: false,
        status: 409,
        message: "Milestone has already been funded.",
      };
    }

    console.error(
      "FUND_MILESTONE_SERVICE_ERROR",
      error
    );

    return {
      success: false,
      status: 500,
      message: "Unable to fund milestone.",
    };
  }
}
