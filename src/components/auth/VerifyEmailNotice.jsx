"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const STATUS_CONFIG = {
  "check-email": {
    eyebrow: "Email verification",
    title: "Check your inbox",
    message: "Please check your inbox and verify your email.",
    iconStatus: "check-email",
  },
  "missing-token": {
    eyebrow: "Verification issue",
    title: "Link incomplete",
    message: "The verification link is missing a token. Please request a new verification email.",
    iconStatus: "error",
  },
  "invalid-token": {
    eyebrow: "Verification issue",
    title: "Invalid link",
    message: "This verification link is invalid or has already been used.",
    iconStatus: "error",
  },
  "expired-token": {
    eyebrow: "Verification expired",
    title: "Link expired",
    message: "Your verification link has expired. Please request a new verification email.",
    iconStatus: "error",
  },
  "server-error": {
    eyebrow: "Verification issue",
    title: "Something went wrong",
    message: "We could not verify your email right now. Please try again.",
    iconStatus: "error",
  },
};

function StatusIcon({ status }) {
  if (status === "success") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <path
          d="M20 6L9 17L4 12"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === "error") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <path
          d="M12 8V12.5M12 16H12.01M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M4 7.5L11.05 12.2C11.62 12.58 12.38 12.58 12.95 12.2L20 7.5M6 19H18C19.1 19 20 18.1 20 17V7C20 5.9 19.1 5 18 5H6C4.9 5 4 5.9 4 7V17C4 18.1 4.9 19 6 19Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function VerifyEmailNotice() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const statusParam = searchParams.get("status");

  const initialStatus = STATUS_CONFIG[statusParam]
    ? statusParam
    : "check-email";

  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState(STATUS_CONFIG[initialStatus].message);
  const [resending, setResending] = useState(false);

  const config = useMemo(() => {
    return STATUS_CONFIG[status] || STATUS_CONFIG["check-email"];
  }, [status]);

  async function handleResendEmail() {
    if (!email) {
      setStatus("missing-token");
      setMessage("Email is missing. Please register again or try logging in.");
      toast.error("Email is missing.");
      return;
    }

    setResending(true);
    setStatus("check-email");
    setMessage("Sending verification email...");

    try {
      const res = await fetch("/api/auth/resend-email-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          data.message || "Could not resend verification email.";
        setStatus("server-error");
        setMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      setStatus("check-email");
      setMessage(
        data.message || "Verification email sent again. Please check your inbox."
      );
      toast.success(data.message || "Verification email sent again.");
    } catch (error) {
      console.error("RESEND_VERIFICATION_EMAIL_ERROR", error);
      setStatus("server-error");
      setMessage("Something went wrong while resending verification email.");
      toast.error("Something went wrong while resending verification email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#070707] font-body text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            background: "#17120e",
            color: "#fff7ed",
            padding: "13px 15px",
            fontSize: "14px",
            fontWeight: 500,
          },
        }}
      />

      <section className="grid min-h-dvh lg:grid-cols-2">
        <div className="relative flex min-h-dvh items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.06),transparent_28%),radial-gradient(circle_at_70%_88%,rgba(192,149,53,0.08),transparent_34%)]" />

          <div className="relative z-10 w-full max-w-[390px]">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-14 inline-flex items-center gap-2 text-sm font-medium text-white/58 transition hover:text-white"
            >
              <span className="text-lg leading-none">←</span>
              Back
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <div className="mb-9 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                  <StatusIcon status={config.iconStatus} />
                </div>

                <p className="text-sm font-semibold text-[#d6ad72]">
                  {config.eyebrow}
                </p>

                <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.065em] text-white sm:text-6xl">
                  {config.title}
                </h1>

                <p className="mt-6 max-w-sm text-base leading-7 text-white/58">
                  {message || config.message}
                </p>
              </motion.div>
            </AnimatePresence>

            {email && (
              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.045] px-5 py-4 text-sm font-semibold text-white/86">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/34">
                  Sent to
                </p>
                <p className="break-all">{email}</p>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resending}
                className="h-12 w-full rounded-xl bg-[#d6ad72] text-sm font-bold text-[#130d08] transition hover:bg-[#e2bd83] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.045] text-sm font-bold text-white transition hover:bg-white/[0.08]"
              >
                Go to login
              </button>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-dvh overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=90)",
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.10)_0%,rgba(7,7,7,0.00)_42%,rgba(7,7,7,0.08)_100%)]" />

          <div className="absolute right-10 top-10 rounded-full border border-white/35 bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md">
            Secure verification
          </div>
        </div>
      </section>
    </main>
  );
}
