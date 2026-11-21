import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientDashboard from "@/components/client/ClientDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return <ClientDashboard user={session?.user} />;
}
