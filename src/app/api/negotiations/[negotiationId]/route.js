import { evidenceSubmission } from "@/services/evidence-upload";
import { accountEndpoint } from "@/lib/account-api";
import { negotiation, respond } from "@/services/marketplace.service";

export const GET = accountEndpoint(["CLIENT", "FREELANCER"], negotiation, { query: true });
export const PATCH = accountEndpoint(["CLIENT", "FREELANCER"], respond, { readSubmission: evidenceSubmission });
