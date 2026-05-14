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
        router.push("/login");
        return;
      }

      const role = session.user.role;

      if (role === "CLIENT") {
        router.push("/client/dashboard");
      } else if (role === "FREELANCER") {
        router.push("/freelancer/dashboard");
      } else {
        router.push("/unauthorized");
      }
    }

    handleRedirect();

  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-slate-600">
          Redirecting...
        </p>
      </div>

    </main>
  );
}