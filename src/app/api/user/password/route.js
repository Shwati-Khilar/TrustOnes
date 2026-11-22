import { accountEndpoint } from "@/lib/account-api";
import { changePassword } from "@/services/account.service";

export const PUT = accountEndpoint(["CLIENT", "FREELANCER"], changePassword, { body: true });
