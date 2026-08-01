import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const AVAILABILITY_VALUES = ["AVAILABLE", "BUSY_OPEN", "NOT_AVAILABLE"];

const DEFAULT_WORKSPACE_VALUES = [
  "DASHBOARD",
  "DEAL_ROOMS",
  "MILESTONES",
  "MESSAGES",
  "WALLET",
  "SETTINGS",
];

const CURRENCY_VALUES = ["INR", "USD", "EUR"];

const THEME_VALUES = ["WARM_PREMIUM", "LIGHT_MINIMAL", "DARK_SAAS"];

const LANGUAGE_VALUES = ["EN", "HI"];

const SUPPORT_TYPES = [
  "PROJECT",
  "WALLET",
  "SUBMISSION",
  "ACCOUNT_ACCESS",
  "ACCOUNT_DELETION",
  "OTHER",
];

function formatDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function cleanText(value, maxLength = 500) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

function cleanName(value) {
  const name = cleanText(value, 80);

  if (!name || name.length < 2) {
    throw new Error("Name must be at least 2 characters.");
  }

  return name;
}

function cleanPassword(value) {
  if (typeof value !== "string") return "";
  return value;
}

function cleanBoolean(value, fallback = true) {
  if (typeof value === "boolean") return value;
  return fallback;
}

function cleanEnum(value, allowedValues, fallback) {
  if (allowedValues.includes(value)) return value;
  return fallback;
}

function cleanTimezone(value) {
  const timezone = cleanText(value, 80);
  return timezone || "Asia/Kolkata";
}

function getPreferenceDefaults() {
  return {
    emailNotifications: true,
    pushNotifications: true,
    deadlineAlerts: true,
    paymentAlerts: true,
    messageAlerts: true,
    disputeAlerts: true,
    profileVisible: true,
    showEarnings: false,
    theme: "WARM_PREMIUM",
    language: "EN",
    timezone: "Asia/Kolkata",
    defaultWorkspace: "DASHBOARD",
    preferredCurrency: "INR",
  };
}

function mapPreferences(preference) {
  const defaults = getPreferenceDefaults();

  if (!preference) {
    return defaults;
  }

  return {
    emailNotifications: preference.emailNotifications,
    pushNotifications: preference.pushNotifications,
    deadlineAlerts: preference.deadlineAlerts,
    paymentAlerts: preference.paymentAlerts,
    messageAlerts: preference.messageAlerts,
    disputeAlerts: preference.disputeAlerts,
    profileVisible: preference.profileVisible,
    showEarnings: preference.showEarnings,
    theme: preference.theme || defaults.theme,
    language: preference.language || defaults.language,
    timezone: preference.timezone || defaults.timezone,
    defaultWorkspace: preference.defaultWorkspace || defaults.defaultWorkspace,
    preferredCurrency: preference.preferredCurrency || defaults.preferredCurrency,
  };
}

function buildPreferenceData(payload = {}) {
  const defaults = getPreferenceDefaults();

  return {
    emailNotifications: cleanBoolean(
      payload.emailNotifications,
      defaults.emailNotifications
    ),
    pushNotifications: cleanBoolean(
      payload.pushNotifications,
      defaults.pushNotifications
    ),
    deadlineAlerts: cleanBoolean(payload.deadlineAlerts, defaults.deadlineAlerts),
    paymentAlerts: cleanBoolean(payload.paymentAlerts, defaults.paymentAlerts),
    messageAlerts: cleanBoolean(payload.messageAlerts, defaults.messageAlerts),
    disputeAlerts: cleanBoolean(payload.disputeAlerts, defaults.disputeAlerts),
    profileVisible: cleanBoolean(payload.profileVisible, defaults.profileVisible),
    showEarnings: cleanBoolean(payload.showEarnings, defaults.showEarnings),
    theme: cleanEnum(payload.theme, THEME_VALUES, defaults.theme),
    language: cleanEnum(payload.language, LANGUAGE_VALUES, defaults.language),
    timezone: cleanTimezone(payload.timezone),
    defaultWorkspace: cleanEnum(
      payload.defaultWorkspace,
      DEFAULT_WORKSPACE_VALUES,
      defaults.defaultWorkspace
    ),
    preferredCurrency: cleanEnum(
      payload.preferredCurrency,
      CURRENCY_VALUES,
      defaults.preferredCurrency
    ),
  };
}

function mapSupportTicket(ticket) {
  return {
    id: ticket.id,
    title: ticket.title,
    message: ticket.message,
    type: ticket.type,
    status: ticket.status,
    createdAt: ticket.createdAt.toISOString(),
    createdAtDisplay: formatDate(ticket.createdAt),
    updatedAt: ticket.updatedAt.toISOString(),
    updatedAtDisplay: formatDate(ticket.updatedAt),
  };
}

export async function getFreelancerSettings(freelancerId) {
  const user = await prisma.user.findUnique({
    where: {
      id: freelancerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      provider: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: true,

      freelancerProfile: {
        select: {
          availability: true,
          location: true,
          professionalTitle: true,
        },
      },

      userPreference: {
        select: {
          emailNotifications: true,
          pushNotifications: true,
          deadlineAlerts: true,
          paymentAlerts: true,
          messageAlerts: true,
          disputeAlerts: true,
          profileVisible: true,
          showEarnings: true,
          theme: true,
          language: true,
          timezone: true,
          defaultWorkspace: true,
          preferredCurrency: true,
        },
      },

      supportTickets: {
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    account: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      hasPassword: Boolean(user.passwordHash),
      joinedAt: user.createdAt.toISOString(),
      joinedAtDisplay: formatDate(user.createdAt),
      updatedAt: user.updatedAt.toISOString(),
      updatedAtDisplay: formatDate(user.updatedAt),
    },

    freelancer: {
      availability: user.freelancerProfile?.availability || "AVAILABLE",
      location: user.freelancerProfile?.location || "",
      professionalTitle:
        user.freelancerProfile?.professionalTitle || "Freelance Developer",
    },

    preferences: mapPreferences(user.userPreference),

    supportTickets: user.supportTickets.map(mapSupportTicket),
  };
}

export async function updateFreelancerAccountSettings(freelancerId, payload) {
  const name = cleanName(payload.name);
  const availability = cleanEnum(
    payload.availability,
    AVAILABILITY_VALUES,
    "AVAILABLE"
  );

  const preferenceData = buildPreferenceData(payload.preferences || {});

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: freelancerId,
      },
      data: {
        name,
      },
    }),

    prisma.freelancerProfile.upsert({
      where: {
        userId: freelancerId,
      },
      update: {
        availability,
      },
      create: {
        userId: freelancerId,
        availability,
      },
    }),

    prisma.userPreference.upsert({
      where: {
        userId: freelancerId,
      },
      update: preferenceData,
      create: {
        userId: freelancerId,
        ...preferenceData,
      },
    }),
  ]);

  return getFreelancerSettings(freelancerId);
}

export async function updateFreelancerPassword(freelancerId, payload) {
  const currentPassword = cleanPassword(payload.currentPassword);
  const newPassword = cleanPassword(payload.newPassword);

  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: freelancerId,
    },
    select: {
      id: true,
      passwordHash: true,
      provider: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.passwordHash) {
    throw new Error("Password change is not available for social login accounts.");
  }

  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!validPassword) {
    throw new Error("Current password is incorrect.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: freelancerId,
    },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return {
    passwordUpdated: true,
  };
}

export async function createFreelancerSupportTicket(freelancerId, payload) {
  const type = cleanEnum(payload.type, SUPPORT_TYPES, "OTHER");
  const message = cleanText(payload.message, 1200);

  if (!message || message.length < 10) {
    throw new Error("Support message must be at least 10 characters.");
  }

  const title =
    cleanText(payload.title, 120) ||
    `${type
      .split("_")
      .join(" ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())} Request`;

  await prisma.supportTicket.create({
    data: {
      userId: freelancerId,
      type,
      title,
      message,
    },
  });

  return getFreelancerSettings(freelancerId);
}