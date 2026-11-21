-- CreateEnum
CREATE TYPE "DefaultWorkspace" AS ENUM ('DASHBOARD', 'DEAL_ROOMS', 'MILESTONES', 'MESSAGES', 'WALLET', 'SETTINGS');

-- CreateEnum
CREATE TYPE "PreferredCurrency" AS ENUM ('INR', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "UserThemePreference" AS ENUM ('WARM_PREMIUM', 'LIGHT_MINIMAL', 'DARK_SAAS');

-- CreateEnum
CREATE TYPE "UserLanguage" AS ENUM ('EN', 'HI');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportTicketType" AS ENUM ('PROJECT', 'WALLET', 'SUBMISSION', 'ACCOUNT_ACCESS', 'ACCOUNT_DELETION', 'OTHER');

-- CreateEnum
CREATE TYPE "MilestoneFundingStatus" AS ENUM ('UNFUNDED', 'PAYMENT_PENDING', 'FUNDED_LOCKED', 'UNDER_REVIEW', 'REVISION_REQUESTED', 'RELEASED', 'REFUND_PENDING', 'REFUNDED', 'DISPUTED', 'PARTIALLY_RELEASED');

-- CreateEnum
CREATE TYPE "PaymentTransactionStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'VERIFIED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutTransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RefundTransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('DEVELOPMENT', 'DESIGN', 'VIDEO', 'DOCUMENT', 'WRITING', 'GENERAL');

-- CreateEnum
CREATE TYPE "MilestoneSubmissionStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'REVISION_REQUESTED', 'APPROVED', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubmissionAttachmentVisibility" AS ENUM ('PREVIEW', 'FINAL_LOCKED');

-- CreateEnum
CREATE TYPE "SubmissionAttachmentType" AS ENUM ('LINK', 'IMAGE', 'VIDEO', 'DOCUMENT', 'ARCHIVE', 'SOURCE_CODE', 'DESIGN_FILE', 'OTHER');

-- CreateEnum
CREATE TYPE "SubmissionAccessAction" AS ENUM ('VIEW_PREVIEW', 'ATTEMPT_FINAL_ACCESS', 'DOWNLOAD_FINAL');

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "deadlineAlerts" BOOLEAN NOT NULL DEFAULT true,
    "paymentAlerts" BOOLEAN NOT NULL DEFAULT true,
    "messageAlerts" BOOLEAN NOT NULL DEFAULT true,
    "disputeAlerts" BOOLEAN NOT NULL DEFAULT true,
    "profileVisible" BOOLEAN NOT NULL DEFAULT true,
    "showEarnings" BOOLEAN NOT NULL DEFAULT false,
    "theme" "UserThemePreference" NOT NULL DEFAULT 'WARM_PREMIUM',
    "language" "UserLanguage" NOT NULL DEFAULT 'EN',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "defaultWorkspace" "DefaultWorkspace" NOT NULL DEFAULT 'DASHBOARD',
    "preferredCurrency" "PreferredCurrency" NOT NULL DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "SupportTicketType" NOT NULL DEFAULT 'OTHER',
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_fundings" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "platformFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "freelancerReceivable" DECIMAL(12,2) NOT NULL,
    "status" "MilestoneFundingStatus" NOT NULL DEFAULT 'UNFUNDED',
    "fundedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "reviewDueAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "disputedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestone_fundings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "milestoneFundingId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY_TEST',
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentTransactionStatus" NOT NULL DEFAULT 'CREATED',
    "verifiedAt" TIMESTAMP(3),
    "rawWebhookEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_transactions" (
    "id" TEXT NOT NULL,
    "milestoneFundingId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PayoutTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "providerPayoutId" TEXT,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_transactions" (
    "id" TEXT NOT NULL,
    "milestoneFundingId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "reason" TEXT,
    "status" "RefundTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "providerRefundId" TEXT,
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refund_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_submissions" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "submissionType" "SubmissionType" NOT NULL DEFAULT 'GENERAL',
    "status" "MilestoneSubmissionStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
    "title" TEXT NOT NULL,
    "note" TEXT,
    "previewUrl" TEXT,
    "proofUrl" TEXT,
    "repositoryUrl" TEXT,
    "liveUrl" TEXT,
    "sourceFileUrl" TEXT,
    "finalDeliveryUrl" TEXT,
    "finalDeliveryNote" TEXT,
    "isFinalDeliveryLocked" BOOLEAN NOT NULL DEFAULT true,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewDueAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "clientFeedback" TEXT,
    "revisionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestone_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_attachments" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "attachmentType" "SubmissionAttachmentType" NOT NULL DEFAULT 'LINK',
    "visibility" "SubmissionAttachmentVisibility" NOT NULL DEFAULT 'PREVIEW',
    "storageKey" TEXT,
    "externalUrl" TEXT,
    "fileName" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "checksum" TEXT,
    "watermarkEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_access_logs" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "attachmentId" TEXT,
    "userId" TEXT,
    "action" "SubmissionAccessAction" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "support_tickets_userId_idx" ON "support_tickets"("userId");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_type_idx" ON "support_tickets"("type");

-- CreateIndex
CREATE INDEX "support_tickets_createdAt_idx" ON "support_tickets"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "milestone_fundings_milestoneId_key" ON "milestone_fundings"("milestoneId");

-- CreateIndex
CREATE INDEX "milestone_fundings_clientId_idx" ON "milestone_fundings"("clientId");

-- CreateIndex
CREATE INDEX "milestone_fundings_freelancerId_idx" ON "milestone_fundings"("freelancerId");

-- CreateIndex
CREATE INDEX "milestone_fundings_status_idx" ON "milestone_fundings"("status");

-- CreateIndex
CREATE INDEX "milestone_fundings_reviewDueAt_idx" ON "milestone_fundings"("reviewDueAt");

-- CreateIndex
CREATE INDEX "payment_transactions_clientId_idx" ON "payment_transactions"("clientId");

-- CreateIndex
CREATE INDEX "payment_transactions_milestoneFundingId_idx" ON "payment_transactions"("milestoneFundingId");

-- CreateIndex
CREATE INDEX "payment_transactions_providerOrderId_idx" ON "payment_transactions"("providerOrderId");

-- CreateIndex
CREATE INDEX "payment_transactions_providerPaymentId_idx" ON "payment_transactions"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payout_transactions_freelancerId_idx" ON "payout_transactions"("freelancerId");

-- CreateIndex
CREATE INDEX "payout_transactions_milestoneFundingId_idx" ON "payout_transactions"("milestoneFundingId");

-- CreateIndex
CREATE INDEX "payout_transactions_status_idx" ON "payout_transactions"("status");

-- CreateIndex
CREATE INDEX "refund_transactions_clientId_idx" ON "refund_transactions"("clientId");

-- CreateIndex
CREATE INDEX "refund_transactions_milestoneFundingId_idx" ON "refund_transactions"("milestoneFundingId");

-- CreateIndex
CREATE INDEX "refund_transactions_status_idx" ON "refund_transactions"("status");

-- CreateIndex
CREATE INDEX "milestone_submissions_milestoneId_idx" ON "milestone_submissions"("milestoneId");

-- CreateIndex
CREATE INDEX "milestone_submissions_freelancerId_idx" ON "milestone_submissions"("freelancerId");

-- CreateIndex
CREATE INDEX "milestone_submissions_status_idx" ON "milestone_submissions"("status");

-- CreateIndex
CREATE INDEX "milestone_submissions_submissionType_idx" ON "milestone_submissions"("submissionType");

-- CreateIndex
CREATE INDEX "milestone_submissions_versionNumber_idx" ON "milestone_submissions"("versionNumber");

-- CreateIndex
CREATE INDEX "submission_attachments_submissionId_idx" ON "submission_attachments"("submissionId");

-- CreateIndex
CREATE INDEX "submission_attachments_visibility_idx" ON "submission_attachments"("visibility");

-- CreateIndex
CREATE INDEX "submission_attachments_attachmentType_idx" ON "submission_attachments"("attachmentType");

-- CreateIndex
CREATE INDEX "submission_access_logs_submissionId_idx" ON "submission_access_logs"("submissionId");

-- CreateIndex
CREATE INDEX "submission_access_logs_attachmentId_idx" ON "submission_access_logs"("attachmentId");

-- CreateIndex
CREATE INDEX "submission_access_logs_userId_idx" ON "submission_access_logs"("userId");

-- CreateIndex
CREATE INDEX "submission_access_logs_action_idx" ON "submission_access_logs"("action");

-- CreateIndex
CREATE INDEX "submission_access_logs_createdAt_idx" ON "submission_access_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_fundings" ADD CONSTRAINT "milestone_fundings_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_fundings" ADD CONSTRAINT "milestone_fundings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_fundings" ADD CONSTRAINT "milestone_fundings_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_milestoneFundingId_fkey" FOREIGN KEY ("milestoneFundingId") REFERENCES "milestone_fundings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_transactions" ADD CONSTRAINT "payout_transactions_milestoneFundingId_fkey" FOREIGN KEY ("milestoneFundingId") REFERENCES "milestone_fundings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_transactions" ADD CONSTRAINT "payout_transactions_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund_transactions" ADD CONSTRAINT "refund_transactions_milestoneFundingId_fkey" FOREIGN KEY ("milestoneFundingId") REFERENCES "milestone_fundings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund_transactions" ADD CONSTRAINT "refund_transactions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_submissions" ADD CONSTRAINT "milestone_submissions_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_submissions" ADD CONSTRAINT "milestone_submissions_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_attachments" ADD CONSTRAINT "submission_attachments_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "milestone_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_access_logs" ADD CONSTRAINT "submission_access_logs_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "milestone_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_access_logs" ADD CONSTRAINT "submission_access_logs_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "submission_attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_access_logs" ADD CONSTRAINT "submission_access_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
