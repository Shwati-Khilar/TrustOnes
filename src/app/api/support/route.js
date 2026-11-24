import { accountEndpoint } from "@/lib/account-api";
import { createTicket, ownTickets } from "@/services/support.service";

export const GET = accountEndpoint(["CLIENT", "FREELANCER"], ownTickets);
export const POST = accountEndpoint(["CLIENT", "FREELANCER"], createTicket, { body: true, status: 201 });
