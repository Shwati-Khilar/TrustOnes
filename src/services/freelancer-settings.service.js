import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { accountName, availability, nonemptyPatch } from "@/lib/account-fields";
import { buildPreferenceUpdate, mapPreferences } from "@/services/client-settings.service";
import { createTicket } from "@/services/support.service";

function formatDate(value) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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

const settingsPatch = nonemptyPatch({
  name: accountName, availability, preferences: z.record(z.string(), z.unknown()),
});

export async function updateFreelancerAccountSettings(userId, input) {
  const payload = settingsPatch.parse(input);
  const preferences = payload.preferences && buildPreferenceUpdate(payload.preferences);
  await prisma.$transaction(async tx => {
    if (payload.name !== undefined) {
      await tx.user.update({ where: { id: userId }, data: { name: payload.name } });
    }
    if (payload.availability !== undefined) {
      const data = { availability: payload.availability };
      await tx.freelancerProfile.upsert({ where: { userId }, update: data, create: { userId, ...data } });
    }
    if (preferences) {
      await tx.userPreference.upsert({ where: { userId }, update: preferences, create: { userId, ...preferences } });
    }
  });
  return getFreelancerSettings(userId);
}

export async function createFreelancerSupportTicket(userId, payload) {
  await createTicket(userId, payload);
  return getFreelancerSettings(userId);
}
