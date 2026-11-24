import { accountEndpoint } from "@/lib/account-api";
import { sharedListing } from "@/services/marketplace.service";

export const GET = accountEndpoint(["FREELANCER"], sharedListing, { query: true });
