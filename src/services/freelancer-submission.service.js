import { prisma } from "@/lib/prisma";

const REVIEW_WINDOW_HOURS = 72;

const SUBMISSION_TYPES = [
  "DEVELOPMENT",
  "DESIGN",
  "VIDEO",
  "DOCUMENT",
  "WRITING",
  "GENERAL",
];

const ATTACHMENT_TYPES = [
  "LINK",
  "IMAGE",
  "VIDEO",
  "DOCUMENT",
  "ARCHIVE",
  "SOURCE_CODE",
  "DESIGN_FILE",
  "OTHER",
];

const ATTACHMENT_VISIBILITIES = ["PREVIEW", "FINAL_LOCKED"];

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function formatDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function cleanText(value, maxLength = 500) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

function cleanRequiredText(value, label, minLength = 3, maxLength = 300) {
  const cleaned = cleanText(value, maxLength);

  if (!cleaned || cleaned.length < minLength) {
    throw new Error(`${label} must be at least ${minLength} characters.`);
  }

  return cleaned;
}

function cleanEnum(value, allowedValues, fallback) {
  if (allowedValues.includes(value)) return value;
  return fallback;
}

function cleanUrl(value, label) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  if (cleaned.length > 800) {
    throw new Error(`${label} is too long.`);
  }

  try {
    const parsedUrl = new URL(cleaned);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error();
    }

    return parsedUrl.toString();
  } catch {
    throw new Error(`${label} must be a valid http/https URL.`);
  }
}

function submissionSelect() {
  return {
    id: true,
    submissionType: true,
    status: true,
    title: true,
    note: true,
    previewUrl: true,
    proofUrl: true,
    repositoryUrl: true,
    liveUrl: true,
    sourceFileUrl: true,
    finalDeliveryUrl: true,
    finalDeliveryNote: true,
    isFinalDeliveryLocked: true,
    versionNumber: true,
    submittedAt: true,
    reviewDueAt: true,
    reviewedAt: true,
    clientFeedback: true,
    revisionReason: true,
    createdAt: true,
    updatedAt: true,
    attachments: {
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        label: true,
        description: true,
        attachmentType: true,
        visibility: true,
        storageKey: true,
        externalUrl: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
        checksum: true,
        watermarkEnabled: true,
        createdAt: true,
      },
    },
  };
}

function mapAttachmentForFreelancer(attachment) {
  return {
    id: attachment.id,
    label: attachment.label,
    description: attachment.description || "",
    attachmentType: attachment.attachmentType,
    visibility: attachment.visibility,
    storageKey: attachment.storageKey,
    externalUrl: attachment.externalUrl,
    fileName: attachment.fileName || "",
    mimeType: attachment.mimeType || "",
    fileSize: attachment.fileSize || 0,
    checksum: attachment.checksum || "",
    watermarkEnabled: attachment.watermarkEnabled,
    lockedForClient: attachment.visibility === "FINAL_LOCKED",
    createdAt: attachment.createdAt.toISOString(),
    createdAtDisplay: formatDateTime(attachment.createdAt),
  };
}

function mapSubmissionForFreelancer(submission) {
  return {
    id: submission.id,
    submissionType: submission.submissionType,
    status: submission.status,
    title: submission.title,
    note: submission.note || "",
    previewUrl: submission.previewUrl || "",
    proofUrl: submission.proofUrl || "",
    repositoryUrl: submission.repositoryUrl || "",
    liveUrl: submission.liveUrl || "",
    sourceFileUrl: submission.sourceFileUrl || "",
    finalDeliveryUrl: submission.finalDeliveryUrl || "",
    finalDeliveryNote: submission.finalDeliveryNote || "",
    isFinalDeliveryLocked: submission.isFinalDeliveryLocked,
    versionNumber: submission.versionNumber,
    submittedAt: submission.submittedAt?.toISOString() || null,
    submittedAtDisplay: formatDateTime(submission.submittedAt),
    reviewDueAt: submission.reviewDueAt?.toISOString() || null,
    reviewDueAtDisplay: formatDateTime(submission.reviewDueAt),
    reviewedAt: submission.reviewedAt?.toISOString() || null,
    reviewedAtDisplay: formatDateTime(submission.reviewedAt),
    clientFeedback: submission.clientFeedback || "",
    revisionReason: submission.revisionReason || "",
    createdAt: submission.createdAt.toISOString(),
    createdAtDisplay: formatDateTime(submission.createdAt),
    attachments: submission.attachments.map(mapAttachmentForFreelancer),
  };
}

function mapFunding(funding) {
  if (!funding) {
    return {
      exists: false,
      status: "UNFUNDED",
      amount: 0,
      amountDisplay: formatCurrency(0),
      freelancerReceivable: 0,
      freelancerReceivableDisplay: formatCurrency(0),
      reviewDueAt: null,
      reviewDueAtDisplay: "No date",
    };
  }

  return {
    exists: true,
    id: funding.id,
    status: funding.status,
    amount: Number(funding.amount || 0),
    amountDisplay: formatCurrency(funding.amount),
    platformFee: Number(funding.platformFee || 0),
    platformFeeDisplay: formatCurrency(funding.platformFee),
    freelancerReceivable: Number(funding.freelancerReceivable || 0),
    freelancerReceivableDisplay: formatCurrency(funding.freelancerReceivable),
    fundedAt: funding.fundedAt?.toISOString() || null,
    fundedAtDisplay: formatDateTime(funding.fundedAt),
    submittedAt: funding.submittedAt?.toISOString() || null,
    submittedAtDisplay: formatDateTime(funding.submittedAt),
    reviewDueAt: funding.reviewDueAt?.toISOString() || null,
    reviewDueAtDisplay: formatDateTime(funding.reviewDueAt),
    releasedAt: funding.releasedAt?.toISOString() || null,
    releasedAtDisplay: formatDateTime(funding.releasedAt),
    refundedAt: funding.refundedAt?.toISOString() || null,
    refundedAtDisplay: formatDateTime(funding.refundedAt),
    disputedAt: funding.disputedAt?.toISOString() || null,
    disputedAtDisplay: formatDateTime(funding.disputedAt),
  };
}

function getSubmitAvailability(milestone) {
  if (!milestone.funding) {
    return {
      canSubmit: false,
      reason: "This milestone is not funded yet.",
    };
  }

  if (!["FUNDED_LOCKED", "REVISION_REQUESTED"].includes(milestone.funding.status)) {
    return {
      canSubmit: false,
      reason: `Submission is not allowed while funding status is ${milestone.funding.status}.`,
    };
  }

  if (!["IN_PROGRESS", "REJECTED"].includes(milestone.status)) {
    return {
      canSubmit: false,
      reason: `Submission is not allowed while milestone status is ${milestone.status}.`,
    };
  }

  return {
    canSubmit: true,
    reason: "",
  };
}

function buildAttachmentData(attachments = []) {
  if (!Array.isArray(attachments)) return [];

  return attachments
    .slice(0, 10)
    .map((attachment, index) => {
      const externalUrl = cleanUrl(
        attachment.externalUrl || attachment.url,
        `Attachment ${index + 1} URL`
      );

      if (!externalUrl && !attachment.storageKey) {
        return null;
      }

      return {
        label:
          cleanText(attachment.label, 80) ||
          `Attachment ${String(index + 1).padStart(2, "0")}`,
        description: cleanText(attachment.description, 300),
        attachmentType: cleanEnum(
          attachment.attachmentType,
          ATTACHMENT_TYPES,
          "LINK"
        ),
        visibility: cleanEnum(
          attachment.visibility,
          ATTACHMENT_VISIBILITIES,
          "PREVIEW"
        ),
        storageKey: cleanText(attachment.storageKey, 500),
        externalUrl,
        fileName: cleanText(attachment.fileName, 180),
        mimeType: cleanText(attachment.mimeType, 120),
        fileSize:
          Number.isInteger(Number(attachment.fileSize)) &&
          Number(attachment.fileSize) > 0
            ? Number(attachment.fileSize)
            : null,
        checksum: cleanText(attachment.checksum, 160),
        watermarkEnabled:
          attachment.visibility === "FINAL_LOCKED"
            ? false
            : typeof attachment.watermarkEnabled === "boolean"
              ? attachment.watermarkEnabled
              : true,
      };
    })
    .filter(Boolean);
}

function buildSubmissionData(payload = {}) {
  const title = cleanRequiredText(payload.title, "Submission title", 3, 160);

  const data = {
    submissionType: cleanEnum(
      payload.submissionType,
      SUBMISSION_TYPES,
      "GENERAL"
    ),
    title,
    note: cleanText(payload.note, 1600),
    previewUrl: cleanUrl(payload.previewUrl, "Preview URL"),
    proofUrl: cleanUrl(payload.proofUrl, "Proof URL"),
    repositoryUrl: cleanUrl(payload.repositoryUrl, "Repository URL"),
    liveUrl: cleanUrl(payload.liveUrl, "Live URL"),
    sourceFileUrl: cleanUrl(payload.sourceFileUrl, "Source file URL"),
    finalDeliveryUrl: cleanUrl(payload.finalDeliveryUrl, "Final delivery URL"),
    finalDeliveryNote: cleanText(payload.finalDeliveryNote, 1200),
  };

  const attachments = buildAttachmentData(payload.attachments);

  const hasPreview =
    data.previewUrl ||
    data.proofUrl ||
    data.liveUrl ||
    attachments.some((attachment) => attachment.visibility === "PREVIEW");

  if (!hasPreview) {
    throw new Error(
      "Add at least one safe preview, proof, live URL, or preview attachment."
    );
  }

  return {
    data,
    attachments,
  };
}

async function findMilestoneForFreelancer(freelancerId, milestoneId) {
  return prisma.milestone.findFirst({
    where: {
      id: milestoneId,
      project: {
        freelancerId,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      amount: true,
      dueDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      project: {
        select: {
          id: true,
          title: true,
          status: true,
          clientId: true,
          freelancerId: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      funding: {
        select: {
          id: true,
          amount: true,
          platformFee: true,
          freelancerReceivable: true,
          status: true,
          fundedAt: true,
          submittedAt: true,
          reviewDueAt: true,
          releasedAt: true,
          refundedAt: true,
          disputedAt: true,
        },
      },
      submissions: {
        orderBy: {
          versionNumber: "desc",
        },
        select: submissionSelect(),
      },
    },
  });
}

export async function getFreelancerMilestoneSubmissions(
  freelancerId,
  milestoneId
) {
  const milestone = await findMilestoneForFreelancer(freelancerId, milestoneId);

  if (!milestone) {
    return null;
  }

  const submitAvailability = getSubmitAvailability(milestone);
  const submissions = milestone.submissions.map(mapSubmissionForFreelancer);

  return {
    milestone: {
      id: milestone.id,
      title: milestone.title,
      description: milestone.description || "",
      amount: Number(milestone.amount || 0),
      amountDisplay: formatCurrency(milestone.amount),
      dueDate: milestone.dueDate?.toISOString() || null,
      dueDateDisplay: formatDate(milestone.dueDate),
      status: milestone.status,
      project: {
        id: milestone.project.id,
        title: milestone.project.title,
        status: milestone.project.status,
        client: milestone.project.client,
      },
      createdAt: milestone.createdAt.toISOString(),
      createdAtDisplay: formatDate(milestone.createdAt),
      updatedAt: milestone.updatedAt.toISOString(),
      updatedAtDisplay: formatDate(milestone.updatedAt),
    },

    funding: mapFunding(milestone.funding),

    submissionRules: {
      canSubmit: submitAvailability.canSubmit,
      blockReason: submitAvailability.reason,
      reviewWindowHours: REVIEW_WINDOW_HOURS,
      finalDeliveryLockedUntilApproval: true,
      previewRequiresFundedMilestone: true,
    },

    latestSubmission: submissions[0] || null,
    submissions,
  };
}

export async function submitFreelancerMilestoneWork(
  freelancerId,
  milestoneId,
  payload
) {
  const milestone = await findMilestoneForFreelancer(freelancerId, milestoneId);

  if (!milestone) {
    throw new Error("Milestone not found or not assigned to you.");
  }

  const submitAvailability = getSubmitAvailability(milestone);

  if (!submitAvailability.canSubmit) {
    throw new Error(submitAvailability.reason);
  }

  const { data, attachments } = buildSubmissionData(payload);

  const latestSubmission = await prisma.milestoneSubmission.aggregate({
    where: {
      milestoneId,
    },
    _max: {
      versionNumber: true,
    },
  });

  const versionNumber = Number(latestSubmission._max.versionNumber || 0) + 1;
  const submittedAt = new Date();
  const reviewDueAt = addHours(submittedAt, REVIEW_WINDOW_HOURS);

  await prisma.$transaction(async (tx) => {
    await tx.milestoneSubmission.create({
      data: {
        milestoneId,
        freelancerId,
        submissionType: data.submissionType,
        status: "UNDER_REVIEW",
        title: data.title,
        note: data.note,
        previewUrl: data.previewUrl,
        proofUrl: data.proofUrl,
        repositoryUrl: data.repositoryUrl,
        liveUrl: data.liveUrl,
        sourceFileUrl: data.sourceFileUrl,
        finalDeliveryUrl: data.finalDeliveryUrl,
        finalDeliveryNote: data.finalDeliveryNote,
        isFinalDeliveryLocked: true,
        versionNumber,
        submittedAt,
        reviewDueAt,
        attachments: {
          create: attachments,
        },
      },
    });

    await tx.milestone.update({
      where: {
        id: milestoneId,
      },
      data: {
        status: "SUBMITTED",
      },
    });

    await tx.milestoneFunding.update({
      where: {
        milestoneId,
      },
      data: {
        status: "UNDER_REVIEW",
        submittedAt,
        reviewDueAt,
      },
    });
  });

  return getFreelancerMilestoneSubmissions(freelancerId, milestoneId);
}