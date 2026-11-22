import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ticketTypes, ticketStatuses } from "@/lib/support-options";

const ticket = z.strictObject({
  type: z.enum(ticketTypes), title: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(1200),
});

export function createTicket(userId, input) {
  const data = ticket.parse(input);
  return prisma.supportTicket.create({ data: { ...data, userId } });
}

export function ownTickets(userId) {
  return prisma.supportTicket.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export function triageTickets() {
  return prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, role: true } } },
  });
}

export function setTicketStatus(_adminId, input, { ticketId }) {
  const data = z.strictObject({ status: z.enum(ticketStatuses) }).parse(input);
  return prisma.supportTicket.update({ where: { id: ticketId }, data });
}
