import { accountEndpoint } from "@/lib/account-api";
import { evidenceLimits } from "@/services/evidence-upload";
export const GET=accountEndpoint(["CLIENT","FREELANCER"],evidenceLimits);
