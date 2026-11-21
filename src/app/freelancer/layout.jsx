import { requirePortal } from "@/lib/portal-session";

export default async function FreelancerLayout({ children }) {
  await requirePortal("FREELANCER");
  return children;
}
