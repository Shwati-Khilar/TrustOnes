import { z } from "zod";
import { accountEndpoint } from "@/lib/account-api";
import { inbox } from "@/services/marketplace.service";
import { getFreelancerProposalSummary } from "@/services/freelancer-invite.service";

const filters = z.strictObject({
  status: z.enum(["ALL", "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN", "CLOSED"]).default("ALL"),
  search: z.string().trim().max(150).default(""),
  page: z.coerce.number().int().min(1).max(100000).default(1),
});

export const GET = accountEndpoint(["FREELANCER"], async (id, query) => {
  const options = filters.parse(query);
  const [threads, summary] = await Promise.all([
    inbox(id, { page: options.page, status: options.status, search: options.search }),
    getFreelancerProposalSummary(id, options),
  ]);
  return { ...threads, ...summary, invitations: threads.items.filter(row => row.kind === "INVITATION") };
}, { query: true });
