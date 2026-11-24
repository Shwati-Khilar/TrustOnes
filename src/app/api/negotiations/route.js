import { accountEndpoint } from "@/lib/account-api";
import { inbox } from "@/services/marketplace.service";

export const GET = accountEndpoint(["CLIENT", "FREELANCER"], inbox, { query: true });
