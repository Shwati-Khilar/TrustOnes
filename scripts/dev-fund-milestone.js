const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const milestoneId = process.argv[2];

  if (!milestoneId) {
    throw new Error("Usage: node scripts/dev-fund-milestone.js <milestoneId>");
  }

  const milestone = await prisma.milestone.findUnique({
    where: {
      id: milestoneId,
    },
    include: {
      project: true,
    },
  });

  if (!milestone) {
    throw new Error("Milestone not found.");
  }

  if (!milestone.project.clientId) {
    throw new Error("Project does not have a client.");
  }

  if (!milestone.project.freelancerId) {
    throw new Error("Project does not have an assigned freelancer.");
  }

  const amount = milestone.amount || 0;

  await prisma.$transaction([
    prisma.milestoneFunding.upsert({
      where: {
        milestoneId,
      },
      update: {
        clientId: milestone.project.clientId,
        freelancerId: milestone.project.freelancerId,
        amount,
        platformFee: 0,
        freelancerReceivable: amount,
        status: "FUNDED_LOCKED",
        fundedAt: new Date(),
      },
      create: {
        milestoneId,
        clientId: milestone.project.clientId,
        freelancerId: milestone.project.freelancerId,
        amount,
        platformFee: 0,
        freelancerReceivable: amount,
        status: "FUNDED_LOCKED",
        fundedAt: new Date(),
      },
    }),

    prisma.milestone.update({
      where: {
        id: milestoneId,
      },
      data: {
        status: "IN_PROGRESS",
      },
    }),
  ]);

  console.log("Milestone funded locally for testing:", milestoneId);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });