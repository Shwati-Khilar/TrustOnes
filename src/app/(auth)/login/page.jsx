import { currentSession } from "@/lib/portal-session";
import { accountDestination } from "@/lib/permissions";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await currentSession();
  if (session?.user?.id) redirect(accountDestination(session.user));

  return <LoginForm /> ;
}