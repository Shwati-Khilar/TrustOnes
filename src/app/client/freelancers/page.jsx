"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, Star, Users } from "lucide-react";

import { freelancers } from "@/components/client/FreelancerContents/FreelancerData";

const categories = ["All", "Development", "Design", "Data & AI", "Writing"];

function initials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FreelancersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFreelancers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return freelancers.filter((freelancer) => {
      const matchesCategory =
        selectedCategory === "All" || freelancer.category === selectedCategory;

      const matchesSearch =
        !term ||
        freelancer.name.toLowerCase().includes(term) ||
        freelancer.title.toLowerCase().includes(term) ||
        freelancer.location.toLowerCase().includes(term) ||
        freelancer.skills.some((skill) => skill.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const averageTrust = Math.round(
    freelancers.reduce((sum, freelancer) => sum + freelancer.trustScore, 0) /
      freelancers.length
  );

  const averageRating = (
    freelancers.reduce((sum, freelancer) => sum + freelancer.rating, 0) /
    freelancers.length
  ).toFixed(1);

  const stats = [
    {
      label: "Verified Freelancers",
      value: String(freelancers.length),
      helper: "Identity checked",
      icon: Users,
    },
    {
      label: "Average Trust Score",
      value: `${averageTrust}/100`,
      helper: "Across all talent",
      icon: Star,
    },
    {
      label: "Average Rating",
      value: averageRating,
      helper: "From completed projects",
      icon: Star,
    },
  ];

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
            Verified talent
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
            Browse freelancers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Every freelancer on TrustOnes is identity-verified and trust-scored.
            Hire with confidence through escrow-protected projects.
          </p>
        </div>

        <Link
          href="/client/projects/create"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          Post a Project
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-[#5f4a3c]">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
                    {stat.value}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f0d7c3] bg-[#fff7ed] text-[#7c341d]">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-[#7c6858]">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-4 py-3">
            <Search size={18} className="shrink-0 text-[#806049]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, skill, or location..."
              className="w-full bg-transparent text-sm font-medium text-[#2b1810] outline-none placeholder:text-[#a99a88]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-[#6f2e1c] text-white shadow-lg shadow-[#6f2e1c]/20"
                      : "border border-[#eadfd2] bg-white/80 text-[#7a4a34] hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <p className="text-sm font-bold text-[#7c6858]">
            {filteredFreelancers.length} shown
          </p>
        </div>
      </section>

      {filteredFreelancers.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            No freelancers match this search.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFreelancers.map((freelancer) => (
            <article
              key={freelancer.id}
              className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#35170f] text-sm font-black text-[#f8d6a3]">
                    {initials(freelancer.name)}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-black leading-tight text-[#24130c]">
                      {freelancer.name}
                    </h2>

                    <p className="mt-0.5 text-xs font-semibold leading-snug text-[#806049]">
                      {freelancer.title}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-[#fff7ed] px-2.5 py-1 text-[10px] font-black tracking-wide text-[#8a4a1d]">
                  {freelancer.badge}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#7c6858]">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#806049]" />
                  {freelancer.location}
                </span>

                <span className="flex items-center gap-1 text-[#b45309]">
                  <Star size={13} fill="currentColor" />
                  {freelancer.rating} ({freelancer.jobs} jobs)
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#8a4a1d]">
                  <span>Trust score</span>
                  <span>{freelancer.trustScore}/100</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eadfd2]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                    style={{ width: `${freelancer.trustScore}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#eadfd2] bg-[#fffaf3] px-2.5 py-1 text-[11px] font-bold text-[#6f5a4c]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#fffaf3] px-4 py-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                    Rate
                  </p>

                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    ₹{freelancer.rate}/hr
                  </p>
                </div>

                <Link
                  href="/client/messages"
                  className="rounded-xl border border-[#eadfd2] bg-white px-4 py-2 text-xs font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                >
                  Message
                </Link>
              </div>

              <Link
                href="/client/projects/create"
                className="mt-3 flex h-11 items-center justify-center rounded-xl bg-[#6f2e1c] text-sm font-black text-white transition hover:bg-[#5b2416]"
              >
                Invite to project
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
