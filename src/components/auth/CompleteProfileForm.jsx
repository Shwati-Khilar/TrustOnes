"use client";

import { useEffect, useMemo, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const ROLE_DATA = {
  CLIENT: {
    label: "Client",
    title: "Project Owner",
    headline: "Hire with clarity.",
    description:
      "Post trusted projects, define milestones, and work with verified professionals.",
    image: "/roles/client.png",
    badge: "Build mode",
    stats: ["Milestones", "Approvals", "Secure flow"],
  },
  FREELANCER: {
    label: "Freelancer",
    title: "Skilled Professional",
    headline: "Work with confidence.",
    description:
      "Accept structured work, track delivery, and build trust through proof-based progress.",
    image: "/roles/freelancer.png",
    badge: "Deliver mode",
    stats: ["Clear scope", "Proof of work", "Trusted clients"],
  },
};

export default function CompleteProfileForm() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  const activeRole = useMemo(() => ROLE_DATA[selectedRole], [selectedRole]);

  useEffect(() => {
    async function checkUserSession() {
      const session = await getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      if (session.user.status === "SUSPENDED") {
        router.replace("/unauthorized");
        return;
      }

      if (!session.user.emailVerified) {
        router.replace(
          `/verify-email?email=${encodeURIComponent(session.user.email)}`
        );
        return;
      }

      if (session.user.role && session.user.status === "ACTIVE") {
        router.replace("/redirect");
        return;
      }

      setCheckingSession(false);
    }

    checkUserSession();
  }, [router]);

  function handleRoleSelect(role) {
    if (loading) return;
    setSelectedRole(role);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || "Could not complete profile.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Profile completed.");

      setTimeout(() => {
        router.replace("/redirect");
        router.refresh();
      }, 600);
    } catch (err) {
      console.error("COMPLETE_PROFILE_FORM_ERROR", err);
      const message = "Something went wrong while completing your profile.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#070707] font-body text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(214,173,114,0.16),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.06),transparent_28%)]" />

        <div className="relative flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#d6ad72]" />
          <p className="text-sm font-medium text-white/58">
            Checking your account...
          </p>
        </div>
      </main>
    );
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(214,173,114,0.16),transparent_25%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_80%_75%,rgba(214,173,114,0.10),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.96),rgba(0,0,0,0.86),rgba(28,18,10,0.92))]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.09]">
        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 mx-auto grid min-h-dvh max-w-[1360px] items-center gap-8 px-5 py-6 lg:grid-cols-[0.9fr_1.25fr]"
      >
        <section className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[32px] border border-white/12 bg-white/[0.045] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/[0.1]"
              >
                TrustOnes
              </button>

              <span className="rounded-full border border-[#d6ad72]/30 bg-[#d6ad72]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d6ad72]">
                Role select
              </span>
            </div>

            <p className="text-sm font-semibold text-[#d6ad72]">
              Complete profile
            </p>

            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.065em] text-white sm:text-6xl">
              Choose your role.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-white/58">
              Select how you want to use TrustOnes. Your dashboard and workflow
              will be personalized from here.
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-100"
              >
                {error}
              </motion.div>
            )}

            <div className="mt-8 grid gap-4">
              {Object.entries(ROLE_DATA).map(([role, data]) => {
                const active = selectedRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`group relative overflow-hidden rounded-[24px] border p-5 text-left transition duration-300 ${
                      active
                        ? "border-[#d6ad72]/70 bg-[#d6ad72]/12 shadow-[0_20px_60px_rgba(214,173,114,0.12)]"
                        : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-role-glow"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,173,114,0.16),transparent_35%)]"
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                        }}
                      />
                    )}

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`text-sm font-bold uppercase tracking-[0.18em] ${
                            active ? "text-[#d6ad72]" : "text-white/38"
                          }`}
                        >
                          {data.badge}
                        </p>

                        <h2 className="mt-3 text-2xl font-bold text-white">
                          {data.label}
                        </h2>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/58">
                          {data.description}
                        </p>
                      </div>

                      <div
                        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? "border-[#d6ad72] bg-[#d6ad72] text-[#130d08]"
                            : "border-white/14 text-white/42"
                        }`}
                      >
                        {active ? "✓" : ""}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 h-13 w-full rounded-full bg-[#d6ad72] px-5 py-4 text-sm font-bold text-[#130d08] shadow-[0_20px_60px_rgba(214,173,114,0.22)] transition hover:bg-[#e2bd83] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving your role..." : "Enter workspace"}
            </button>
          </motion.div>
        </section>

        <section className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-[#d6ad72]/28 bg-[#061018]/70 shadow-[0_34px_130px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:min-h-[760px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(214,173,114,0.18),transparent_28%),radial-gradient(circle_at_50%_78%,rgba(255,255,255,0.08),transparent_32%)]" />

            <div className="absolute inset-0 opacity-[0.18]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(214,173,114,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(214,173,114,0.22)_1px,transparent_1px)] bg-[size:58px_58px]" />
            </div>

            <div className="absolute left-7 top-7 rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
              Appearance
            </div>

            <div className="absolute right-7 top-7 rounded-full border border-[#d6ad72]/35 bg-[#d6ad72]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d6ad72] backdrop-blur-md">
              {activeRole.title}
            </div>

            <div className="absolute bottom-7 left-7 right-7 z-20 rounded-[28px] border border-white/14 bg-black/30 p-6 text-white shadow-[0_22px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`role-copy-${selectedRole}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad72]">
                    Selected role
                  </p>

                  <h2 className="mt-3 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                    {activeRole.headline}
                  </h2>

                  <p className="mt-4 max-w-md text-sm font-medium leading-6 text-white/68">
                    {activeRole.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {activeRole.stats.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute inset-x-0 bottom-[140px] top-20 z-10 flex items-end justify-center px-6">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`role-image-${selectedRole}`}
                  src={activeRole.image}
                  alt={activeRole.label}
                  initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_35px_70px_rgba(0,0,0,0.55)]"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            <div className="pointer-events-none absolute inset-x-10 bottom-[155px] h-px bg-gradient-to-r from-transparent via-[#d6ad72]/50 to-transparent" />
          </motion.div>
        </section>
      </form>
    </main>
  );
}