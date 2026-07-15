"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function ErrorBox({ message }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.18 }}
          className="mb-5 rounded-2xl border border-[#efb8b4] bg-[#fff1ef] px-5 py-4 text-sm font-bold text-[#b42318]"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error === "EMAIL_NOT_VERIFIED") {
        const message = "Please verify your email before logging in.";
        setError(message);
        toast.error(message);

        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
        return;
      }

      if (result?.error === "USE_GOOGLE_LOGIN") {
        const message = "This account uses Google login. Continue with Google.";
        setError(message);
        toast.error(message);
        return;
      }

      if (result?.error) {
        const message = "Invalid email or password.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back.");

      setTimeout(() => {
        router.push("/redirect");
        router.refresh();
      }, 600);
    } catch (err) {
      console.error("LOGIN_FORM_ERROR", err);
      const message = "Something went wrong while logging in.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/redirect",
      });
    } catch (err) {
      console.error("GOOGLE_LOGIN_ERROR", err);
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-black px-4 py-6 font-body text-[#18120c] sm:px-6 lg:px-8">
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

      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2200&q=90)",
          }}
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.70)_0%,rgba(0,0,0,0.48)_48%,rgba(0,0,0,0.32)_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_82%_82%,rgba(192,149,53,0.13),transparent_30%)]" />

        <div className="absolute inset-0 backdrop-blur-[0.8px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-48px)] max-w-[1180px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid w-full overflow-hidden rounded-[34px] border border-white/25 bg-[#f5ece1]/96 shadow-[0_34px_110px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:min-h-[690px] lg:grid-cols-[0.92fr_1.08fr]"
        >
          <section className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-16">
            <div className="w-full max-w-[400px]">
              <div className="mb-9 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="rounded-full border border-[#d8c8b5] bg-white/55 px-4 py-2 text-sm font-bold text-[#3b2416] shadow-sm transition hover:bg-white/80"
                >
                  TrustOnes
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="rounded-full border border-[#d8c8b5] bg-white/38 px-4 py-2 text-sm font-bold text-[#8b5e34] shadow-sm transition hover:bg-white/70 hover:text-[#4a2b19]"
                >
                  Register
                </button>
              </div>

              <div className="mb-7">
                <p className="text-sm font-bold text-[#8b5e34]">
                  Welcome back
                </p>

                <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.065em] text-[#1f140d]">
                  Login to your account
                </h1>

                <p className="mt-4 text-base leading-7 text-[#7a6a59]">
                  Continue your trusted project journey.
                </p>
              </div>

              <ErrorBox message={error} />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-[#39281d]">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="mt-2 h-12 w-full rounded-full border border-[#dacbb8] bg-white/84 px-5 text-[15px] font-medium text-[#1f140d] outline-none ring-4 ring-transparent transition placeholder:text-[#a99a88] focus:border-[#8b5e34] focus:bg-white focus:ring-[#8b5e34]/15"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#39281d]">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-sm font-semibold text-[#8b5e34] transition hover:text-[#5a3825]"
                    >
                      Forgot?
                    </button>
                  </div>

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="mt-2 h-12 w-full rounded-full border border-[#dacbb8] bg-white/84 px-5 text-[15px] font-medium text-[#1f140d] outline-none ring-4 ring-transparent transition placeholder:text-[#a99a88] focus:border-[#8b5e34] focus:bg-white focus:ring-[#8b5e34]/15"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-press h-12 w-full rounded-full bg-[#3b2416] text-sm font-bold text-white shadow-[0_16px_34px_rgba(59,36,22,0.22)] transition hover:bg-[#2d1b10] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#ded2bf]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9d8f7f]">
                  or
                </span>
                <div className="h-px flex-1 bg-[#ded2bf]" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#d8c8b5] bg-white/72 text-sm font-bold text-[#2d1b10] shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleIcon />
                <span>
                  {googleLoading ? "Opening Google..." : "Continue with Google"}
                </span>
              </button>

              <p className="mt-5 text-center text-sm font-medium text-[#7a6a59]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-bold text-[#8b5e34] transition hover:text-[#5a3825]"
                >
                  Register
                </button>
              </p>
            </div>
          </section>

          <section className="relative hidden min-h-[690px] overflow-hidden rounded-l-[34px] lg:block">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=90)",
              }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.14)_42%,rgba(0,0,0,0.62)_100%)]" />

            <div className="absolute right-8 top-8 rounded-full border border-white/35 bg-white/18 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
              Secure access
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="absolute bottom-8 left-8 right-8 max-w-[500px] rounded-[28px] border border-white/28 bg-black/24 p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
                TrustOnes
              </p>

              <h2 className="max-w-[390px] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em]">
                Every project starts with trust.
              </h2>

              <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-white/78">
                Clear milestones, verified access, and smoother collaboration.
              </p>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </main>
  );
}