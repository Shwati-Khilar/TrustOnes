"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10M6.5 10H17.5C18.6046 10 19.5 10.8954 19.5 12V19C19.5 20.1046 18.6046 21 17.5 21H6.5C5.39543 21 4.5 20.1046 4.5 19V12C4.5 10.8954 5.39543 10 6.5 10ZM12 14.25V16.75"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M3 3L21 21M10.73 10.73C10.28 11.18 10 11.8 10 12.5C10 13.88 11.12 15 12.5 15C13.2 15 13.82 14.72 14.27 14.27M7.53 7.53C5.1 8.79 3.62 10.9 3 12.5C4.04 15.18 7.31 18 12.5 18C14.04 18 15.41 17.75 16.6 17.32M10.9 5.08C11.42 5.03 11.95 5 12.5 5C17.69 5 20.96 7.82 22 12.5C21.68 13.32 21.08 14.25 20.22 15.11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M2.5 12.5C3.55 9.15 6.86 6 12 6C17.14 6 20.45 9.15 21.5 12.5C20.45 15.85 17.14 19 12 19C6.86 19 3.55 15.85 2.5 12.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.5C13.6569 15.5 15 14.1569 15 12.5C15 10.8431 13.6569 9.5 12 9.5C10.3431 9.5 9 10.8431 9 12.5C9 14.1569 10.3431 15.5 12 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-white/78">{label}</label>

      <div className="mt-3 flex h-12 items-center border-b border-white/18 transition focus-within:border-[#d6ad72]">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-full flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/32"
        />

        <button
          type="button"
          onClick={onToggle}
          className="ml-3 text-white/42 transition hover:text-white"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>
    </div>
  );
}

function MessageBox({ type, message }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22 }}
          className={`mt-6 rounded-xl border px-5 py-4 text-sm font-medium leading-6 ${
            type === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/20 bg-red-400/10 text-red-100"
          }`}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      const message = "Reset token is missing. Please request a new reset link.";
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "Password must be at least 8 characters.";
      setError(message);
      toast.error(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || "Something went wrong.";
        setError(message);
        toast.error(message);
        return;
      }

      setSuccess("Password reset successful. Redirecting to login...");
      toast.success("Password reset successful.");

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err) {
      console.error("RESET_PASSWORD_ERROR", err);

      const message = "Something went wrong.";
      setError(message);
      toast.error(message);
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
            className="relative z-10 w-full max-w-[410px]"
          >
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-white/58 transition hover:text-white"
            >
              <span className="text-lg leading-none">←</span>
              Back to login
            </button>

            <div className="mb-9 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
              <LockIcon />
            </div>

            <p className="text-sm font-semibold text-[#d6ad72]">
              Password reset
            </p>

            <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.065em] text-white sm:text-6xl">
              Create new password
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-white/58">
              Choose a strong password to secure your TrustOnes workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-7">
              <PasswordInput
                label="New password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                  if (success) setSuccess("");
                }}
                placeholder="Enter new password"
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />

              <PasswordInput
                label="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                  if (success) setSuccess("");
                }}
                placeholder="Confirm new password"
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
              />

              <div className="rounded-xl border border-white/10 bg-white/[0.045] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/34">
                  Password tip
                </p>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Use at least 8 characters with a mix of letters, numbers, and
                  symbols.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-[#d6ad72] text-sm font-bold text-[#130d08] transition hover:bg-[#e2bd83] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Resetting password..." : "Reset password"}
              </button>
            </form>

            <MessageBox type="error" message={error} />
            <MessageBox type="success" message={success} />
          </motion.div>
        </div>

        <div className="relative hidden min-h-dvh overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=90)",
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.08)_0%,rgba(7,7,7,0.00)_45%,rgba(7,7,7,0.08)_100%)]" />

          <div className="absolute right-10 top-10 rounded-full border border-white/35 bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md">
            Secure reset
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
              Reset safely. Return with confidence.
            </h2>

            <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-white/78">
              Your account access is protected through a secure reset flow.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-[#070707] font-body text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}