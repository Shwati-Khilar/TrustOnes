import { accountEndpoint } from "@/lib/account-api";
import { updateClientProfile } from "@/services/account.service";

export const PATCH = accountEndpoint(["CLIENT"], updateClientProfile, { body: true });
