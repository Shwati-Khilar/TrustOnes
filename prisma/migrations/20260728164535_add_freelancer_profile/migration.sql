-- CreateEnum
CREATE TYPE "FreelancerAvailability" AS ENUM ('AVAILABLE', 'BUSY_OPEN', 'NOT_AVAILABLE');

-- CreateEnum
CREATE TYPE "FreelancerExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "freelancer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "availability" "FreelancerAvailability" NOT NULL DEFAULT 'AVAILABLE',
    "professionalTitle" TEXT,
    "bio" TEXT,
    "experienceLevel" "FreelancerExperienceLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "startingPrice" DECIMAL(12,2),
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "portfolioLinks" JSONB,
    "educationHighlight" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freelancer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "freelancer_profiles_userId_key" ON "freelancer_profiles"("userId");

-- CreateIndex
CREATE INDEX "freelancer_profiles_availability_idx" ON "freelancer_profiles"("availability");

-- CreateIndex
CREATE INDEX "freelancer_profiles_experienceLevel_idx" ON "freelancer_profiles"("experienceLevel");

-- AddForeignKey
ALTER TABLE "freelancer_profiles" ADD CONSTRAINT "freelancer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
