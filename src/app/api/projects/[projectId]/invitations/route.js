import { evidenceSubmission } from "@/services/evidence-upload";
import { accountEndpoint } from "@/lib/account-api";
import { invite } from "@/services/marketplace.service";

export const POST = accountEndpoint(["CLIENT"], invite, { readSubmission: evidenceSubmission, status: 201 });
