// This is a reusable logout button.
// We can place it in client, freelancer, and admin dashboards.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth.client.service";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const data = await logoutUser();

      router.push(data.url || "/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT_ERROR", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}