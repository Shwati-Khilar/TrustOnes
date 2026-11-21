"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const UNAUTHORIZED_IMAGE = "/errors/unauthorized.png";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
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

export default function UnauthorizedPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#070707] px-4 py-6 font-body text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(214,173,114,0.16),transparent_28%),radial-gradient(circle_at_82%_82%,rgba(255,255,255,0.07),transparent_30%)]" />

      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.96),rgba(0,0,0,0.86),rgba(28,18,10,0.9))]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-48px)] max-w-[1240px] items-center justify-center">
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid w-full overflow-hidden rounded-[36px] border border-white/14 bg-white/[0.045] shadow-[0_36px_130px_rgba(0,0,0,0.58)] backdrop-blur-2xl lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_35%,rgba(214,173,114,0.14),transparent_30%)]" />

          <div className="relative flex items-center px-6 py-10 sm:px-10 lg:px-16">
            <div className="w-full max-w-[470px]">
              <Link
                href="/"
                className="mb-14 inline-flex rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/78 transition hover:bg-white/[0.1] hover:text-white"
              >
                TrustOnes
              </Link>

              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-[#d6ad72] shadow-[0_18px_50px_rgba(0,0,0,0.38)]">
                <LockIcon />
              </div>

              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d6ad72]">
                Unauthorized access
              </p>

              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-white sm:text-6xl">
                Access restricted.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/58">
                You are logged in, but this workspace requires different account
                permissions. Please continue with an authorized account.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#d6ad72] px-7 text-sm font-bold text-[#130d08] shadow-[0_20px_60px_rgba(214,173,114,0.22)] transition hover:bg-[#e2bd83]"
                >
                  Go to login
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/14 bg-white/[0.055] px-7 text-sm font-bold text-white transition hover:bg-white/[0.1]"
                >
                  Back home
                </Link>
              </div>

              <p className="mt-6 text-sm leading-6 text-white/38">
                Need access? Switch to the correct account or contact the
                workspace administrator.
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[680px] overflow-hidden lg:block">
            <div className="absolute inset-8 rounded-[34px] border border-[#d6ad72]/18 bg-[#d6ad72]/[0.035]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.55 }}
              className="absolute inset-x-0 top-16 text-center text-[230px] font-black leading-none tracking-[-0.12em] text-white/[0.055] xl:text-[310px]"
            >
              401
            </motion.div>

            <div className="absolute right-10 top-10 z-30 rounded-full border border-[#d6ad72]/30 bg-[#d6ad72]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d6ad72] backdrop-blur-md">
              401 Locked
            </div>

            <div className="absolute inset-x-8 top-20 bottom-[190px] z-20 flex items-center justify-center">
              <motion.img
                src={UNAUTHORIZED_IMAGE}
                alt="Unauthorized access illustration"
                initial={{ opacity: 0, y: 20, scale: 0.94 }}
                animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
                transition={{
                  opacity: {
                    delay: 0.18,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  y: {
                    delay: 0.6,
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    delay: 0.18,
                    duration: 0.45,
                  },
                }}
                className="max-h-full max-w-[560px] object-contain drop-shadow-[0_40px_90px_rgba(0,0,0,0.62)]"
                draggable={false}
              />
            </div>

            <div className="absolute bottom-10 left-10 right-10 z-30 rounded-[28px] border border-white/14 bg-black/30 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad72]">
                System message
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                Permission required
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/58">
                This route is protected by role-based access. Only approved
                users can continue.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}