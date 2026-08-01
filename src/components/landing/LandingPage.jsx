"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  FileCheck2,
  FolderKanban,
  Handshake,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserCheck,
  WalletCards,
} from "lucide-react";

const roles = [
  {
    id: "client",
    title: "Client",
    eyebrow: "Project Owner",
    mode: "Build Mode",
    headline: "Hire with clarity.",
    short:
      "Create projects, fund milestones, review safe previews, and approve releases.",
    description:
      "Post trusted projects, define milestones, fund safely, review preview work, and release payment only when the work is approved.",
    image: "/landing/client-role.png",
    href: "/register?role=CLIENT",
    icon: BriefcaseBusiness,
    chips: ["Milestones", "Approvals", "Secure funding"],
    points: [
      "Create projects with clear scope",
      "Fund one milestone at a time",
      "Review safe preview before release",
      "Approve, request revision, or dispute",
    ],
    controlCards: [
      {
        label: "Funded Milestone",
        value: "₹10,000 locked",
        icon: WalletCards,
      },
      {
        label: "Preview Review",
        value: "Final files hidden",
        icon: Eye,
      },
      {
        label: "Release Control",
        value: "Approve to unlock",
        icon: CircleDollarSign,
      },
    ],
  },
  {
    id: "freelancer",
    title: "Freelancer",
    eyebrow: "Verified Professional",
    mode: "Deliver Mode",
    headline: "Deliver with protection.",
    short:
      "Submit preview proof, lock final delivery, track approval, and get paid fairly.",
    description:
      "Accept structured work, submit safe preview proof, lock final delivery, track approvals, and build trust through proof-based progress.",
    image: "/landing/freelancer-role.png",
    href: "/register?role=FREELANCER",
    icon: UploadCloud,
    chips: ["Preview proof", "Locked delivery", "Payout clarity"],
    points: [
      "Accept trusted project opportunities",
      "Submit safe preview proof",
      "Keep source and final files locked",
      "Track approval and payout status",
    ],
    controlCards: [
      {
        label: "Submit Proof",
        value: "Preview only",
        icon: UploadCloud,
      },
      {
        label: "Final Delivery",
        value: "Locked safely",
        icon: LockKeyhole,
      },
      {
        label: "Payout Status",
        value: "After release",
        icon: CircleDollarSign,
      },
    ],
  },
];

const workflow = [
  {
    title: "Create deal",
    text: "Client and freelancer agree scope.",
  },
  {
    title: "Set milestones",
    text: "Work is split into checkpoints.",
  },
  {
    title: "Fund securely",
    text: "Client funds the milestone.",
  },
  {
    title: "Submit preview",
    text: "Freelancer submits proof.",
  },
  {
    title: "Approve & release",
    text: "Final delivery unlocks.",
  },
];

const trustCards = [
  {
    title: "No unfunded preview",
    text: "Clients can review work only after the milestone is funded.",
    icon: WalletCards,
  },
  {
    title: "Final delivery locked",
    text: "Source files and final exports stay hidden until approval or release.",
    icon: LockKeyhole,
  },
  {
    title: "Proof trail always ready",
    text: "Submissions, revisions, approvals, and disputes stay traceable.",
    icon: ShieldCheck,
  },
];

function Logo({ className = "" }) {
  return (
    <img
      src="/landing/trustones-logo.png"
      alt="TrustOnes"
      className={`object-contain object-left drop-shadow-[0_0_18px_rgba(213,168,91,0.28)] ${className}`}
    />
  );
}

function RoleImageStage({ role, compact = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#030507] ${
        compact
          ? "min-h-[360px] lg:min-h-[500px]"
          : "min-h-[440px] lg:min-h-[620px]"
      }`}
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />

      <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d5a85b]/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-32 w-[80%] -translate-x-1/2 rounded-full bg-black/80 blur-2xl" />

      {failed ? (
        <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-[2rem] border border-[#d5a85b]/30 bg-[#d5a85b]/10 text-7xl font-black text-[#d5a85b]">
          {role.title.charAt(0)}
        </div>
      ) : (
        <img
          src={role.image}
          alt={`${role.title} role visual`}
          onError={() => setFailed(true)}
          className={`relative z-10 w-full object-contain object-center ${
            compact
              ? "h-[340px] sm:h-[430px] lg:h-[480px]"
              : "h-[430px] sm:h-[520px] lg:h-[590px]"
          }`}
        />
      )}
    </div>
  );
}

function HeroRoleVisual({ activeRole, activeRoleId, setActiveRoleId }) {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="absolute -left-10 top-16 h-60 w-60 rounded-full bg-[#d5a85b]/20 blur-3xl" />
      <div className="absolute -right-8 bottom-10 h-64 w-64 rounded-full bg-[#16446b]/25 blur-3xl" />

      <div className="relative rounded-[2.4rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/50 backdrop-blur-2xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/55 sm:text-xs">
            <ShieldCheck size={14} className="text-[#d5a85b]" />
            Trust Role System
          </div>

          <div className="rounded-full border border-[#d5a85b]/30 bg-[#d5a85b]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#f5c66f] sm:text-xs">
            Protected Deal
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.44fr_0.56fr] lg:items-stretch">
          <div className="flex flex-col gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const selected = role.id === activeRoleId;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRoleId(role.id)}
                  className={`rounded-[1.45rem] border p-4 text-left transition ${
                    selected
                      ? "border-[#d5a85b]/65 bg-[#d5a85b]/12 shadow-xl shadow-[#d5a85b]/10"
                      : "border-white/10 bg-white/[0.055] hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d5a85b]/25 bg-[#d5a85b]/10 text-[#f5c66f]">
                      <Icon size={20} />
                    </div>

                    {selected && (
                      <CheckCircle2 size={19} className="text-[#f5c66f]" />
                    )}
                  </div>

                  <p className="text-lg font-black text-white">{role.title}</p>

                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#d5a85b]">
                    {role.mode}
                  </p>

                  <p className="mt-3 text-xs font-semibold leading-5 text-white/45">
                    {role.short}
                  </p>
                </button>
              );
            })}

            <div className="rounded-[1.45rem] border border-[#d5a85b]/20 bg-black/45 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d5a85b] text-[#120d08]">
                  <Handshake size={22} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
                    Live Flow
                  </p>
                  <p className="text-sm font-black text-white">
                    {activeRole.headline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <RoleImageStage role={activeRole} compact />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {activeRole.controlCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-white/10 bg-black/45 p-4"
              >
                <Icon size={18} className="text-[#d5a85b]" />

                <p className="mt-3 text-sm font-black text-white">
                  {card.label}
                </p>

                <p className="mt-1 text-xs font-semibold text-white/38">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeRoleId, setActiveRoleId] = useState("client");

  const activeRole = useMemo(() => {
    return roles.find((role) => role.id === activeRoleId) || roles[0];
  }, [activeRoleId]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-[#f7f0e7]">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 12% 8%, rgba(213,168,91,0.18), transparent 32%), radial-gradient(circle at 82% 16%, rgba(36,90,123,0.18), transparent 30%), radial-gradient(circle at 50% 70%, rgba(111,46,28,0.16), transparent 35%)",
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            className="group flex min-w-[190px] items-center"
            aria-label="TrustOnes home"
          >
            <Logo className="h-12 w-[220px] transition group-hover:opacity-90 sm:h-14 sm:w-[260px]" />
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold text-white/55 md:flex">
            <a href="#roles" className="transition hover:text-[#d5a85b]">
              Roles
            </a>

            <a href="#workflow" className="transition hover:text-[#d5a85b]">
              Workflow
            </a>

            <a href="#security" className="transition hover:text-[#d5a85b]">
              Security
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-2xl bg-[#d5a85b] px-5 py-3 text-sm font-black text-[#120d08] shadow-lg shadow-[#d5a85b]/20 transition hover:bg-[#efc978]"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.84fr_1.16fr] lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d5a85b]/25 bg-[#d5a85b]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#f5c66f] sm:text-[11px]">
            <Sparkles size={14} />
            Built for safer freelance deals
          </div>

          <h1 className="text-5xl font-black tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl">
            Freelance work,
            <br />
            <span className="bg-gradient-to-r from-[#f5c66f] to-[#b7791f] bg-clip-text text-transparent">
              secured by trust.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm font-semibold leading-7 text-white/58 sm:text-base sm:leading-8">
            TrustOnes helps clients and freelancers work through milestone
            funding, protected submissions, locked delivery, and dispute-ready
            collaboration.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#d5a85b] px-7 text-sm font-black text-[#120d08] shadow-xl shadow-[#d5a85b]/20 transition hover:bg-[#efc978]"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-7 text-sm font-black text-white transition hover:bg-white/10"
            >
              Login to Workspace
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              {
                title: "Milestone",
                subtitle: "funded first",
                icon: WalletCards,
              },
              {
                title: "Preview",
                subtitle: "safe review",
                icon: Eye,
              },
              {
                title: "Final",
                subtitle: "locked delivery",
                icon: LockKeyhole,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl transition hover:border-[#d5a85b]/35 hover:bg-[#d5a85b]/10"
                >
                  <Icon size={18} className="text-[#d5a85b]" />

                  <p className="mt-3 text-sm font-black text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 sm:text-xs">
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <HeroRoleVisual
          activeRole={activeRole}
          activeRoleId={activeRoleId}
          setActiveRoleId={setActiveRoleId}
        />
      </section>

      <section
        id="roles"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d5a85b]">
              Choose your role
            </p>

            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
              A workspace that changes with you.
            </h2>
          </div>

          <p className="max-w-lg text-sm font-semibold leading-7 text-white/50 lg:justify-self-end">
            Select a side and the experience explains what that role controls
            inside TrustOnes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white">
                TrustOnes
              </div>

              <div className="rounded-full border border-[#d5a85b]/30 bg-[#d5a85b]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#f5c66f] sm:text-xs">
                Role Select
              </div>
            </div>

            <p className="text-sm font-black text-[#d5a85b]">
              Complete profile
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.075em] text-white sm:text-5xl xl:text-6xl">
              Choose your role.
            </h2>

            <p className="mt-5 text-sm font-semibold leading-7 text-white/45 sm:text-base sm:leading-8">
              Select how you want to use TrustOnes. Your dashboard and workflow
              will be personalized from here.
            </p>

            <div className="mt-8 space-y-4">
              {roles.map((role) => {
                const selected = activeRoleId === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setActiveRoleId(role.id)}
                    className={`w-full rounded-[1.75rem] border p-5 text-left transition ${
                      selected
                        ? "border-[#d5a85b]/65 bg-[#d5a85b]/12 shadow-xl shadow-[#d5a85b]/10"
                        : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`text-xs font-black uppercase tracking-[0.24em] ${
                            selected ? "text-[#f5c66f]" : "text-white/35"
                          }`}
                        >
                          {role.mode}
                        </p>

                        <h3 className="mt-4 text-2xl font-black text-white">
                          {role.title}
                        </h3>

                        <p className="mt-3 text-sm font-semibold leading-7 text-white/48">
                          {role.description}
                        </p>
                      </div>

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-[#d5a85b] bg-[#d5a85b] text-[#120d08]"
                            : "border-white/15 text-white/25"
                        }`}
                      >
                        {selected ? "✓" : ""}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Link
              href={activeRole.href}
              className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#d5a85b] text-sm font-black text-[#120d08] shadow-xl shadow-[#d5a85b]/20 transition hover:bg-[#efc978]"
            >
              Enter workspace
            </Link>
          </div>

          <div className="rounded-[2.25rem] border border-[#d5a85b]/25 bg-[#061017] p-4 shadow-2xl shadow-black/40 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/50 sm:text-xs">
                Appearance
              </div>

              <div className="rounded-full border border-[#d5a85b]/30 bg-[#d5a85b]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#f5c66f] sm:text-xs">
                {activeRole.eyebrow}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.56fr_0.44fr] xl:items-stretch">
              <RoleImageStage role={activeRole} />

              <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-black/45 p-5 backdrop-blur-xl sm:p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d5a85b]">
                    Selected Role
                  </p>

                  <h3 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
                    {activeRole.headline}
                  </h3>

                  <p className="mt-4 text-sm font-semibold leading-7 text-white/55">
                    {activeRole.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {activeRole.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-black text-white/70"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {activeRole.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3"
                    >
                      <UserCheck size={17} className="text-[#d5a85b]" />

                      <p className="text-sm font-semibold text-white/60">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href={activeRole.href}
                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#d5a85b] px-5 py-4 text-sm font-black text-[#120d08] transition hover:bg-[#efc978]"
                >
                  Continue as {activeRole.title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d5a85b]">
              How it works
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
              One protected deal flow.
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {workflow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-center"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#d5a85b] text-sm font-black text-[#120d08]">
                  {index + 1}
                </div>

                <p className="text-sm font-black text-white">{step.title}</p>

                <p className="mt-2 text-xs font-semibold leading-5 text-white/40">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="security"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {trustCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d5a85b]/25 bg-[#d5a85b]/10 text-[#f5c66f]">
                  <Icon size={22} />
                </div>

                <h3 className="text-xl font-black tracking-[-0.03em] text-white">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm font-semibold leading-7 text-white/50">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="rounded-[2.5rem] border border-[#d5a85b]/20 bg-[#100d09] px-6 py-16 text-center text-white shadow-2xl shadow-black/50 sm:px-10">
          <Logo className="mx-auto mb-8 h-12 w-[240px] opacity-90" />

          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-[-0.06em] sm:text-6xl">
            Start your next freelance deal with clarity.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-7 text-white/50">
            Join as a client or freelancer and work through milestones,
            protected submissions, locked final delivery, and trusted releases.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register?role=CLIENT"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#d5a85b] px-7 text-sm font-black text-[#120d08] transition hover:bg-[#efc978]"
            >
              Join as Client
            </Link>

            <Link
              href="/register?role=FREELANCER"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-7 text-sm font-black text-white transition hover:bg-white/15"
            >
              Join as Freelancer
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm font-semibold text-white/35 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <Logo className="h-10 w-[190px] opacity-90" />
            <p>© 2026 TrustOnes. Built for safer freelance collaboration.</p>
          </div>

          <div className="flex gap-5">
            <Link href="/login" className="hover:text-[#d5a85b]">
              Login
            </Link>

            <Link href="/register" className="hover:text-[#d5a85b]">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}