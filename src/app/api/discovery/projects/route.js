import { accountEndpoint } from "@/lib/account-api";
import { discover } from "@/services/marketplace.service";

export const GET = accountEndpoint(["FREELANCER"], discover, { query: true });
