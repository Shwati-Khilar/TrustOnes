// Client-side account preferences.
// Follows the same route -> service -> Prisma pattern as
// freelancer-settings.service.js, but only touches UserPreference.
import { prisma } from "@/lib/prisma";

const THEME_VALUES = ["WARM_PREMIUM", "LIGHT_MINIMAL", "DARK_SAAS"];

const LANGUAGE_VALUES = ["EN", "HI"];

const CURRENCY_VALUES = ["INR", "USD", "EUR"];

const DEFAULT_WORKSPACE_VALUES = [
  "DASHBOARD",
  "DEAL_ROOMS",
  "MILESTONES",
  "MESSAGES",
  "WALLET",
  "SETTINGS",
];

// Boolean columns on the UserPreference model that a client may change.
const BOOLEAN_PREFERENCE_FIELDS = [
  "emailNotifications",
  "pushNotifications",
  "deadlineAlerts",
  "paymentAlerts",
  "messageAlerts",
  "disputeAlerts",
  "profileVisible",
  "showEarnings",
];

// Enum columns on the UserPreference model, with their allowed values.
const ENUM_PREFERENCE_FIELDS = {
  theme: THEME_VALUES,
  language: LANGUAGE_VALUES,
  preferredCurrency: CURRENCY_VALUES,
  defaultWorkspace: DEFAULT_WORKSPACE_VALUES,
};

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
    preferredCurrency:
      preference.preferredCurrency || defaults.preferredCurrency,
  };
}

function isValidTimezone(value) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch (error) {
    return false;
  }
}

// Only the keys actually present in the payload are returned, so a PATCH
// touching one toggle never resets the rest of the record.
function buildPreferenceUpdate(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body must be a settings object.");
  }

  const data = {};

  for (const field of BOOLEAN_PREFERENCE_FIELDS) {
    if (!(field in payload)) continue;

    if (typeof payload[field] !== "boolean") {
      throw new Error(`${field} must be true or false.`);
    }

    data[field] = payload[field];
  }

  for (const [field, allowedValues] of Object.entries(ENUM_PREFERENCE_FIELDS)) {
    if (!(field in payload)) continue;

    if (!allowedValues.includes(payload[field])) {
      throw new Error(
        `${field} must be one of: ${allowedValues.join(", ")}.`
      );
    }

    data[field] = payload[field];
  }

  if ("timezone" in payload) {
    if (
      typeof payload.timezone !== "string" ||
      !isValidTimezone(payload.timezone.trim())
    ) {
      throw new Error("timezone must be a valid IANA timezone.");
    }

    data.timezone = payload.timezone.trim().slice(0, 80);
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No supported settings were provided.");
  }

  return data;
}

// Always scoped by the authenticated user id, never by a client-supplied id.
export async function getClientPreferences(clientId) {
  const preference = await prisma.userPreference.findUnique({
    where: {
      userId: clientId,
    },
  });

  return mapPreferences(preference);
}

export async function updateClientPreferences(clientId, payload) {
  const data = buildPreferenceUpdate(payload);

  const preference = await prisma.userPreference.upsert({
    where: {
      userId: clientId,
    },
    update: data,
    create: {
      userId: clientId,
      ...getPreferenceDefaults(),
      ...data,
    },
  });

  return {
    preferences: mapPreferences(preference),
    updatedFields: Object.keys(data),
  };
}
