import { currentSession } from "@/lib/portal-session";
import { accountDestination } from "@/lib/permissions";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await currentSession();
  if (session?.user?.id) redirect(accountDestination(session.user));

  return <RegisterForm />;
}