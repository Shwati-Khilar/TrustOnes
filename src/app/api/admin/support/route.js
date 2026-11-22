import { accountEndpoint } from "@/lib/account-api";
import { triageTickets } from "@/services/support.service";

export const GET = accountEndpoint(["ADMIN"], triageTickets);
