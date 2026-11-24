import { accountEndpoint } from "@/lib/account-api";
import { directory } from "@/services/marketplace.service";

export const GET = accountEndpoint(["CLIENT"], directory, { query: true });
