import { requirePortal } from "@/lib/portal-session";

export default async function AdminLayout({ children }) {
  await requirePortal("ADMIN");
  return children;
}
