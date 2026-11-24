import { accountEndpoint } from "@/lib/account-api";
import { publish } from "@/services/marketplace.service";

export const POST = accountEndpoint(["CLIENT"], publish, { body: true });
