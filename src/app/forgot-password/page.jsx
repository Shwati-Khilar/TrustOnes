"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function MailIcon() {
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

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage("Please enter your email address.");
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data = await res.json();

      const responseMessage =
        data.message || "If this email exists, a reset link has been sent.";

      setMessage(responseMessage);

      if (!res.ok) {
        toast.error(responseMessage);
        return;
      }

      toast.success(responseMessage);
    } catch (error) {
      console.error("FORGOT_PASSWORD_ERROR", error);
      setMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[390px]"
          >
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mb-14 inline-flex items-center gap-2 text-sm font-medium text-white/58 transition hover:text-white"
            >
              <span className="text-lg leading-none">←</span>
              Back to login
            </button>

            <div className="mb-9 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
              <MailIcon />
            </div>

            <p className="text-sm font-semibold text-[#d6ad72]">
              Password recovery
            </p>

            <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.065em] text-white sm:text-6xl">
              Forgot password?
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-white/58">
              No worries, enter your email and we’ll send you reset instructions.
            </p>

            <form onSubmit={handleSubmit} className="mt-10">
              <label className="text-sm font-semibold text-white/78">
                Email address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (message) setMessage("");
                }}
                className="mt-3 h-12 w-full border-b border-white/18 bg-transparent px-0 text-[15px] font-medium text-white outline-none transition placeholder:text-white/32 focus:border-[#d6ad72]"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-8 h-12 w-full rounded-xl bg-[#d6ad72] text-sm font-bold text-[#130d08] transition hover:bg-[#e2bd83] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>

            <AnimatePresence initial={false}>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                  className="mt-6 rounded-xl border border-white/10 bg-white/[0.045] px-5 py-4 text-sm font-medium leading-6 text-white/76"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="relative hidden min-h-dvh overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=90)",
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.08)_0%,rgba(7,7,7,0.00)_45%,rgba(7,7,7,0.08)_100%)]" />

          <div className="absolute right-10 top-10 rounded-full border border-white/35 bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md">
            Secure recovery
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.35 }}
            className="absolute bottom-10 left-10 right-10 max-w-[520px] rounded-[28px] border border-white/28 bg-black/24 p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
              TrustOnes
            </p>

            <h2 className="max-w-[430px] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em]">
              Reset access. Keep your work secure.
            </h2>

            <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-white/78">
              We’ll help you safely return to your trusted workspace.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}