import { accountEndpoint } from "@/lib/account-api";
import { getFreelancerProfile, updateFreelancerProfile } from "@/services/freelancer-profile.service";

export const GET = accountEndpoint(["FREELANCER"], getFreelancerProfile, { message: "Freelancer profile fetched successfully." });
export const PATCH = accountEndpoint(["FREELANCER"], updateFreelancerProfile, { body: true, message: "Freelancer profile updated successfully." });
