import { accountEndpoint } from "@/lib/account-api";
import { setTicketStatus } from "@/services/support.service";

export const PATCH = accountEndpoint(["ADMIN"], setTicketStatus, { body: true });
