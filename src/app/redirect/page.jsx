"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleRedirect() {
      const session = await getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const user = session.user;

      if (user.status === "SUSPENDED") {
        router.replace("/unauthorized");
        return;
      }

      if (!user.emailVerified) {
        router.replace(
          `/verify-email?email=${encodeURIComponent(user.email)}`
        );
        return;
      }

      if (!user.role || user.status === "PENDING") {
        router.replace("/complete-profile");
        return;
      }

      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
        return;
      }

      if (user.role === "CLIENT") {
        router.replace("/client/dashboard");
        return;
      }

      if (user.role === "FREELANCER") {
        router.replace("/freelancer/dashboard");
        return;
      }

      router.replace("/unauthorized");
    }

    handleRedirect();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-slate-600">Redirecting...</p>
      </div>
    </main>
  );
}