import { Suspense } from "react";
import { redirect } from "next/navigation";
import VerifyEmailNotice from "@/components/auth/VerifyEmailNotice";

function VerifyEmailFallback() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#070707] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="mt-4 text-sm font-medium text-white/60">
          Loading verification page...
        </p>
      </div>
    </main>
  );
}

export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const tokenParam = params?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  /*
    Backward compatibility:
    If an older email still opens /verify-email?token=..., do not verify
    from the client. Redirect the request to the backend verification route.
  */
  if (token) {
    redirect(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
  }

  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailNotice />
    </Suspense>
  );
}
