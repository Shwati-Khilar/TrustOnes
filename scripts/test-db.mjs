import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("Database connection succeeded.");
} catch {
  console.error("Database connection failed.");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
