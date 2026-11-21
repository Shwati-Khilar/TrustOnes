import { currentSession } from "@/lib/portal-session";
import { accountDestination } from "@/lib/permissions";
import { redirect } from "next/navigation";
import CompleteProfileForm from "@/components/auth/CompleteProfileForm";

export default async function CompleteProfilePage() {
  const session = await currentSession();
  const destination = accountDestination(session?.user);
  if (destination !== "/complete-profile") redirect(destination);

  return (
    <main>
      <CompleteProfileForm />
    </main>
  );
}