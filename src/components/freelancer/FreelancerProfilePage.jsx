"use client";

import { useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ExternalLink,
  Globe,
  GraduationCap,
  IndianRupee,
  Link2,
  Mail,
  MapPin,
  PenLine,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
} from "lucide-react";

const skills = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Prisma",
  "PostgreSQL",
  "UI Engineering",
  "Dashboard Design",
];

const portfolioLinks = [
  {
    label: "GitHub",
    url: "github.com/kushaagra27op",
  },
  {
    label: "Portfolio",
    url: "kushaagra.dev",
  },
  {
    label: "LinkedIn",
    url: "linkedin.com/in/kushaagra",
  },
];

const workStats = [
  {
    label: "Completed Jobs",
    value: "18",
    icon: BriefcaseBusiness,
  },
  {
    label: "Trust Score",
    value: "94",
    icon: ShieldCheck,
  },
  {
    label: "Avg Rating",
    value: "4.8",
    icon: Star,
  },
  {
    label: "Earned",
    value: "₹31k",
    icon: IndianRupee,
  },
];

export default function FreelancerProfilePage() {
  const [phoneVerified, setPhoneVerified] = useState(false);

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Freelancer Profile
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Manage your identity and public freelancer card.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Update your private account details, phone verification, skills,
            portfolio links, availability, and the card clients see before
            inviting you.
          </p>
        </div>

        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
          <Save size={18} />
          Save Profile
        </button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-[#eadfd2] bg-white/80 shadow-sm">
            <div className="h-28 bg-gradient-to-br from-[#35170f] to-[#7c341d]" />

            <div className="-mt-12 px-6 pb-6">
              <div className="relative h-24 w-24 rounded-[1.7rem] border-4 border-[#fffaf3] bg-[#35170f] shadow-xl">
                <div className="flex h-full w-full items-center justify-center text-3xl font-black text-[#f4b454]">
                  K
                </div>

                <button className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#6f2e1c] text-white shadow-lg">
                  <Camera size={16} />
                </button>
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black tracking-[-0.04em] text-[#24130c]">
                    Kushaagra Singh
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#047857]">
                    <BadgeCheck size={13} />
                    Verified
                  </span>
                </div>

                <p className="mt-2 text-sm font-bold text-[#6f2e1c]">
                  Full-stack Frontend Developer
                </p>

                <p className="mt-3 text-sm leading-6 text-[#7c6858]">
                  I build polished, scalable dashboards and SaaS interfaces using
                  React, Next.js, Tailwind, Prisma, and modern product design
                  systems.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {workStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div key={stat.label} className="rounded-2xl bg-[#fffaf3] p-4">
                      <div className="flex items-center gap-2 text-[#6f2e1c]">
                        <Icon size={16} />
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#b79d88]">
                          {stat.label}
                        </p>
                      </div>

                      <p className="mt-2 text-xl font-black text-[#24130c]">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <Sparkles size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Make your card hire-worthy.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Clients should understand your skills, trust level, availability,
              and work quality within a few seconds.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Use a clear professional title",
                "Add strong portfolio links",
                "Keep your availability updated",
                "Write a simple value-focused bio",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-[#f4b454]" />
                  <p className="text-sm font-semibold text-white/78">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Private Account Information
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  This information is used for account security and internal
                  communication.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <UserRound size={21} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Full Name
                </span>

                <input
                  type="text"
                  defaultValue="Kushaagra Singh"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Email Address
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <Mail size={17} className="text-[#9b7a64]" />
                  <input
                    type="email"
                    defaultValue="kushaagra27op@gmail.com"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none"
                  />
                  <BadgeCheck size={17} className="text-[#047857]" />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Phone Number
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <Phone size={17} className="text-[#9b7a64]" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                  />
                </div>
              </label>

              <div>
                <span className="text-sm font-black text-[#24130c]">
                  Phone Verification
                </span>

                <div className="mt-2 flex h-12 items-center justify-between rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <div className="flex items-center gap-2">
                    {phoneVerified ? (
                      <>
                        <BadgeCheck size={17} className="text-[#047857]" />
                        <p className="text-sm font-black text-[#047857]">
                          Verified
                        </p>
                      </>
                    ) : (
                      <>
                        <Phone size={17} className="text-[#b45309]" />
                        <p className="text-sm font-black text-[#b45309]">
                          Not Verified
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setPhoneVerified(true)}
                    className="rounded-xl bg-[#6f2e1c] px-4 py-2 text-xs font-black text-white"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Location
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <MapPin size={17} className="text-[#9b7a64]" />
                  <input
                    type="text"
                    defaultValue="Bhubaneswar, Odisha"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Availability
                </span>

                <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                  <option>Available for new work</option>
                  <option>Busy but open to invites</option>
                  <option>Not available currently</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Public Freelancer Display Card
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  This is what clients will see when they review or invite you.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <WalletCards size={21} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Display Name
                </span>

                <input
                  type="text"
                  defaultValue="Kushaagra Singh"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Professional Title
                </span>

                <input
                  type="text"
                  defaultValue="Full-stack Frontend Developer"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Experience Level
                </span>

                <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                  <option>Intermediate</option>
                  <option>Beginner</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Starting Price
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <IndianRupee size={17} className="text-[#9b7a64]" />
                  <input
                    type="number"
                    defaultValue="5000"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none"
                  />
                </div>
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-black text-[#24130c]">
                Public Bio
              </span>

              <textarea
                rows={5}
                defaultValue="I build polished, scalable dashboards and SaaS interfaces using React, Next.js, Tailwind, Prisma, and modern product design systems."
                className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none focus:border-[#6f2e1c]"
              />
            </label>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                    Skills
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                    Skills shown on your public card.
                  </p>
                </div>

                <PenLine size={20} className="text-[#6f2e1c]" />
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#eadfd2] bg-[#fffaf3] px-3 py-1.5 text-xs font-bold text-[#7c6858]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                <Sparkles size={17} className="text-[#9b7a64]" />
                <input
                  type="text"
                  placeholder="Add a skill..."
                  className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                    Portfolio Links
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                    Add proof of your work.
                  </p>
                </div>

                <Globe size={20} className="text-[#6f2e1c]" />
              </div>

              <div className="space-y-3">
                {portfolioLinks.map((link) => (
                  <div
                    key={link.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                        <Link2 size={17} />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-[#24130c]">
                          {link.label}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                          {link.url}
                        </p>
                      </div>
                    </div>

                    <ExternalLink size={17} className="text-[#9b7a64]" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Education / Highlight
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  Add a short credibility point for clients.
                </p>
              </div>

              <GraduationCap size={21} className="text-[#6f2e1c]" />
            </div>

            <div className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-5">
              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Highlight Line
                </span>

                <input
                  type="text"
                  defaultValue="B.Tech CSE student building scalable AI and SaaS products."
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                />
              </label>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}