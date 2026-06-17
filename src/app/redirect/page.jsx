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

      if (session.user.role === "CLIENT") {
        router.push("/client/dashboard");
      }

      else if (
        session.user.role === "FREELANCER"
      ) {
        router.push("/freelancer/dashboard");
      }

      else {
        router.push("/unauthorized");
      }
    }

    handleRedirect();

  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </main>
  );
}