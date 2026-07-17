"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const layoutTransition = {
  type: "spring",
  stiffness: 130,
  damping: 24,
  mass: 0.8,
};

const fadeTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const ROLE_UI = {
  CLIENT: {
    label: "Client",
    badge: "For clients",
    title: "Create your account",
    subtitle: "Hire verified talent with milestone clarity.",
    heroTitle: "Hire with trust.",
    heroSubtitle: "Clear milestones. Safer payments. Better delivery.",
    buttonText: "Create client profile",
    pageBackground:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=90",
    panelImage:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=90",
    bgPosition: "center center",
    panelPosition: "center center",
  },

  FREELANCER: {
    label: "Freelancer",
    badge: "For freelancers",
    title: "Create your account",
    subtitle: "Work with clients who value clarity.",
    heroTitle: "Work with confidence.",
    heroSubtitle: "Verified clients. Clear scope. Trusted delivery.",
    buttonText: "Create freelancer profile",
    pageBackground:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2400&q=90",
    panelImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=90",
    bgPosition: "center center",
    panelPosition: "center center",
  },
};

function FieldError({ message }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-xs font-semibold text-[#b42318]"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function GeneralError({ message }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="mb-5 rounded-2xl border border-[#f2b8b5] bg-[#fff1ef] px-4 py-3 text-sm font-semibold text-[#b42318]"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const theme = useMemo(() => ROLE_UI[form.role], [form.role]);
  const isClient = form.role === "CLIENT";

  function getFieldError(field) {
    const message = fieldErrors?.[field];

    if (!message) {
      return "";
    }

    return Array.isArray(message) ? message[0] : message;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (error) {
      setError("");
    }
  }

  function handleRoleChange(role) {
    if (role === form.role || loading) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      role,
    }));

    setError("");
    setFieldErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || "Registration failed.";

        setError(message);
        setFieldErrors(data.errors || {});
        toast.error(message);

        if (data.redirectTo) {
          setTimeout(() => {
            router.push(data.redirectTo);
          }, 700);
        }

        return;
      }

      toast.success("Account created. Verify your email.");

      const redirectPath =
        data.redirectTo ||
        `/verify-email?email=${encodeURIComponent(form.email)}`;

      setTimeout(() => {
        router.push(redirectPath);
      }, 900);
    } catch (err) {
      console.error("REGISTER_FORM_ERROR", err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

      <AnimatePresence mode="wait">
        <motion.div
          key={`page-bg-${form.role}`}
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${theme.pageBackground})`,
            backgroundSize: "cover",
            backgroundPosition: theme.bgPosition,
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.66)_45%,rgba(0,0,0,0.38)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.13),transparent_24%),radial-gradient(circle_at_78%_82%,rgba(255,255,255,0.07),transparent_30%),radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.34)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[1.2px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-48px)] max-w-[1180px] items-center justify-center">
        <LayoutGroup>
          <motion.div
            layout
            transition={layoutTransition}
            className="grid w-full overflow-hidden rounded-[34px] border border-white/25 bg-[#f5ece1]/96 shadow-[0_36px_120px_rgba(0,0,0,0.58)] backdrop-blur-xl lg:min-h-[720px] lg:grid-cols-2"
          >
            <motion.section
              layout
              transition={layoutTransition}
              className={`relative order-2 min-h-[430px] overflow-hidden lg:min-h-[720px] ${
                isClient ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`panel-image-${form.role}`}
                  initial={{ opacity: 0, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.995 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-cover"
                  style={{
                    backgroundImage: `url(${theme.panelImage})`,
                    backgroundPosition: theme.panelPosition,
                  }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.68)_100%)]" />

              <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-between p-6 sm:p-8 lg:min-h-[720px] lg:p-10">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-full border border-white/35 bg-white/18 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition hover:bg-white/28"
                  >
                    TrustOnes
                  </button>

                  <span className="rounded-full border border-white/35 bg-white/18 px-4 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                    {theme.badge}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`hero-copy-${form.role}`}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-[440px] rounded-[30px] border border-white/28 bg-black/24 p-7 text-white shadow-[0_24px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl"
                  >
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
                      TrustOnes
                    </p>

                    <h2 className="font-display text-4xl font-semibold leading-[1] tracking-[-0.055em] sm:text-5xl">
                      {theme.heroTitle}
                    </h2>

                    <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-white/80">
                      {theme.heroSubtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>

            <motion.section
              layout
              transition={layoutTransition}
              className={`order-1 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 ${
                isClient ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <div className="w-full max-w-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`form-content-${form.role}`}
                    initial={{ opacity: 0, x: isClient ? 26 : -26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isClient ? -26 : 26 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mb-7">
                      <p className="text-sm font-bold text-[#8b5e34]">
                        {theme.label} registration
                      </p>

                      <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.065em] text-[#1f140d]">
                        {theme.title}
                      </h1>

                      <p className="mt-4 text-base leading-7 text-[#7a6a59]">
                        {theme.subtitle}
                      </p>
                    </div>

                    <div className="mb-7 grid grid-cols-2 rounded-full bg-[#eadfce] p-1">
                      {["CLIENT", "FREELANCER"].map((role) => {
                        const active = form.role === role;

                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleChange(role)}
                            disabled={loading}
                            className={`relative h-11 overflow-hidden rounded-full px-4 text-sm font-bold transition disabled:cursor-not-allowed ${
                              active
                                ? "text-white"
                                : "text-[#806f5d] hover:text-[#2d1b10]"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="role-active-pill"
                                className="absolute inset-0 rounded-full bg-[#5a3825]"
                                transition={{
                                  type: "spring",
                                  stiffness: 360,
                                  damping: 32,
                                }}
                              />
                            )}

                            <span className="relative z-10">
                              {ROLE_UI[role].label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <GeneralError message={error} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-[#39281d]">
                          Full name
                        </label>

                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="mt-2 h-12 w-full rounded-full border border-[#dacbb8] bg-white/90 px-5 text-[15px] font-medium text-[#1f140d] outline-none ring-4 ring-transparent transition placeholder:text-[#a99a88] focus:border-[#8b5e34] focus:bg-white focus:ring-[#8b5e34]/15"
                        />

                        <FieldError message={getFieldError("name")} />
                      </div>

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
                          className="mt-2 h-12 w-full rounded-full border border-[#dacbb8] bg-white/90 px-5 text-[15px] font-medium text-[#1f140d] outline-none ring-4 ring-transparent transition placeholder:text-[#a99a88] focus:border-[#8b5e34] focus:bg-white focus:ring-[#8b5e34]/15"
                        />

                        <FieldError message={getFieldError("email")} />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#39281d]">
                          Password
                        </label>

                        <input
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Minimum 8 characters"
                          className="mt-2 h-12 w-full rounded-full border border-[#dacbb8] bg-white/90 px-5 text-[15px] font-medium text-[#1f140d] outline-none ring-4 ring-transparent transition placeholder:text-[#a99a88] focus:border-[#8b5e34] focus:bg-white focus:ring-[#8b5e34]/15"
                        />

                        <FieldError message={getFieldError("password")} />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-press mt-2 h-12 w-full rounded-full bg-[#3b2416] text-sm font-bold text-white shadow-[0_16px_34px_rgba(59,36,22,0.24)] transition hover:bg-[#2d1b10] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Creating account..." : theme.buttonText}
                      </button>
                    </form>

                    <p className="mt-6 text-center text-sm font-medium text-[#7a6a59]">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="font-bold text-[#8b5e34] transition hover:text-[#5a3825]"
                      >
                        Login
                      </button>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          </motion.div>
        </LayoutGroup>
      </div>
    </main>
  );
}