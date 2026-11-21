const { loadEnvConfig } = require("@next/env");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Check your .env file.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const PASSWORD = "Test@12345";

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function upsertDemoUser({ name, email, role }) {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  return prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      role,
      status: "ACTIVE",
      emailVerified: true,
      passwordHash,
      provider: "credentials",
    },
    create: {
      name,
      email,
      role,
      status: "ACTIVE",
      emailVerified: true,
      passwordHash,
      provider: "credentials",
    },
  });
}

async function findOrCreateProject(clientId, freelancerId) {
  const existingProject = await prisma.project.findFirst({
    where: {
      title: "Demo Secure Submission Project",
      clientId,
    },
  });

  if (existingProject) {
    return prisma.project.update({
      where: {
        id: existingProject.id,
      },
      data: {
        status: "ACTIVE",
        freelancerId,
      },
    });
  }

  return prisma.project.create({
    data: {
      title: "Demo Secure Submission Project",
      description:
        "Demo project for testing secure milestone funding, preview submission, locked final delivery, and freelancer-side workflow.",
      category: "Web Development",
      budget: 25000,
      deadline: addDays(30),
      status: "ACTIVE",
      clientId,
      freelancerId,
    },
  });
}

async function findOrCreateMilestone(projectId) {
  const existingMilestone = await prisma.milestone.findFirst({
    where: {
      projectId,
      title: "Milestone 1 - Secure Submit Work Flow",
    },
  });

  if (existingMilestone) {
    return prisma.milestone.update({
      where: {
        id: existingMilestone.id,
      },
      data: {
        amount: 10000,
        dueDate: addDays(7),
        status: "IN_PROGRESS",
      },
    });
  }

  return prisma.milestone.create({
    data: {
      projectId,
      title: "Milestone 1 - Secure Submit Work Flow",
      description:
        "Freelancer must submit preview proof and locked final delivery. Client can review only safe preview before approval.",
      amount: 10000,
      dueDate: addDays(7),
      status: "IN_PROGRESS",
    },
  });
}

async function main() {
  const client = await upsertDemoUser({
    name: "Demo Client",
    email: "demo.client@trustones.dev",
    role: "CLIENT",
  });

  const freelancer = await upsertDemoUser({
    name: "Demo Freelancer",
    email: "demo.freelancer@trustones.dev",
    role: "FREELANCER",
  });

  await prisma.freelancerProfile.upsert({
    where: {
      userId: freelancer.id,
    },
    update: {
      availability: "AVAILABLE",
      professionalTitle: "Full Stack Developer",
      location: "India",
      bio: "Demo freelancer account for testing TrustOnes secure milestone submission flow.",
      experienceLevel: "INTERMEDIATE",
      startingPrice: 10000,
      skills: ["Next.js", "React", "Node.js", "Prisma", "PostgreSQL"],
      educationHighlight: "Demo testing profile",
    },
    create: {
      userId: freelancer.id,
      availability: "AVAILABLE",
      professionalTitle: "Full Stack Developer",
      location: "India",
      bio: "Demo freelancer account for testing TrustOnes secure milestone submission flow.",
      experienceLevel: "INTERMEDIATE",
      startingPrice: 10000,
      skills: ["Next.js", "React", "Node.js", "Prisma", "PostgreSQL"],
      educationHighlight: "Demo testing profile",
    },
  });

  const project = await findOrCreateProject(client.id, freelancer.id);

  await prisma.proposal.upsert({
    where: {
      projectId_freelancerId: {
        projectId: project.id,
        freelancerId: freelancer.id,
      },
    },
    update: {
      status: "ACCEPTED",
      bidAmount: 25000,
      estimatedDays: 20,
      coverLetter:
        "Accepted demo proposal for testing freelancer-side TrustOnes workflow.",
    },
    create: {
      projectId: project.id,
      freelancerId: freelancer.id,
      status: "ACCEPTED",
      bidAmount: 25000,
      estimatedDays: 20,
      coverLetter:
        "Accepted demo proposal for testing freelancer-side TrustOnes workflow.",
    },
  });

  const milestone = await findOrCreateMilestone(project.id);

  const funding = await prisma.milestoneFunding.upsert({
    where: {
      milestoneId: milestone.id,
    },
    update: {
      clientId: client.id,
      freelancerId: freelancer.id,
      amount: milestone.amount,
      platformFee: 500,
      freelancerReceivable: 9500,
      status: "FUNDED_LOCKED",
      fundedAt: new Date(),
      submittedAt: null,
      reviewDueAt: null,
      releasedAt: null,
      refundedAt: null,
      disputedAt: null,
    },
    create: {
      milestoneId: milestone.id,
      clientId: client.id,
      freelancerId: freelancer.id,
      amount: milestone.amount,
      platformFee: 500,
      freelancerReceivable: 9500,
      status: "FUNDED_LOCKED",
      fundedAt: new Date(),
    },
  });

  const existingPayment = await prisma.paymentTransaction.findFirst({
    where: {
      milestoneFundingId: funding.id,
      status: "VERIFIED",
    },
  });

  if (!existingPayment) {
    await prisma.paymentTransaction.create({
      data: {
        milestoneFundingId: funding.id,
        clientId: client.id,
        provider: "RAZORPAY_TEST",
        providerOrderId: `order_demo_${Date.now()}`,
        providerPaymentId: `pay_demo_${Date.now()}`,
        amount: milestone.amount,
        currency: "INR",
        status: "VERIFIED",
        verifiedAt: new Date(),
        rawWebhookEventId: `demo_event_${Date.now()}`,
      },
    });
  }

  console.log("\nDemo workspace created successfully.\n");

  console.log("Client login:");
  console.log("Email:", client.email);
  console.log("Password:", PASSWORD);

  console.log("\nFreelancer login:");
  console.log("Email:", freelancer.email);
  console.log("Password:", PASSWORD);

  console.log("\nProject:");
  console.log(project.id, "-", project.title);

  console.log("\nFunded milestone:");
  console.log(milestone.id, "-", milestone.title);

  console.log("\nTest URLs:");
  console.log(`http://localhost:3000/freelancer/dashboard`);
  console.log(`http://localhost:3000/freelancer/milestones`);
  console.log(`http://localhost:3000/freelancer/deal-rooms`);
  console.log(
    `http://localhost:3000/api/freelancer/milestones/${milestone.id}/submissions`
  );

  console.log("\nFunding status: FUNDED_LOCKED");
  console.log("Milestone status: IN_PROGRESS\n");
}

main()
  .catch((error) => {
    console.error("\nDemo workspace seed failed:\n");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });