import { redirect } from "next/navigation";
import { currentSession } from "@/lib/portal-session";
import { accountDestination } from "@/lib/permissions";

export default async function RedirectPage() {
  const session = await currentSession();
  redirect(accountDestination(session?.user));
}
