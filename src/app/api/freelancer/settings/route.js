import { accountEndpoint } from "@/lib/account-api";
import { getFreelancerSettings, updateFreelancerAccountSettings, createFreelancerSupportTicket } from "@/services/freelancer-settings.service";
import { changePassword } from "@/services/account.service";

export const GET = accountEndpoint(["FREELANCER"], getFreelancerSettings, { message: "Freelancer settings fetched successfully." });
export const PATCH = accountEndpoint(["FREELANCER"], updateFreelancerAccountSettings, { body: true, message: "Freelancer settings updated successfully." });
export const POST = accountEndpoint(["FREELANCER"], createFreelancerSupportTicket, { body: true, status: 201, message: "Support ticket created successfully." });
export const PUT = accountEndpoint(["FREELANCER"], changePassword, { body: true, message: "Password updated successfully." });
