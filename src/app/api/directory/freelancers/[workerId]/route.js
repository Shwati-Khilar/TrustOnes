import { accountEndpoint } from "@/lib/account-api";
import { workerProfile } from "@/services/marketplace.service";

export const GET = accountEndpoint(["CLIENT"], workerProfile, { query: true });
