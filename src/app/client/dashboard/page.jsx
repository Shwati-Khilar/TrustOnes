import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ClientDashboard from "../../../components/client/ClientDashboard";

export default function DashboardPage() {
  return <ClientDashboard />;
}