import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const users = await prisma.user.findMany();

  console.log("Database connected successfully!");
  console.log("Users:", users);
}

main()
  .catch((error) => {
    console.error("Database connection failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });