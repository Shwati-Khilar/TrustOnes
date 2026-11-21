"use client";

import { useEffect, useMemo, useState } from "react";
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
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

const initialForm = {
  phone: "",
  location: "",
  availability: "AVAILABLE",
  professionalTitle: "Freelance Developer",
  bio: "",
  experienceLevel: "INTERMEDIATE",
  startingPrice: "",
  skills: [],
  portfolioLinks: [],
  educationHighlight: "",
};

const availabilityOptions = [
  { label: "Available for new work", value: "AVAILABLE" },
  { label: "Busy but open to invites", value: "BUSY_OPEN" },
  { label: "Not available currently", value: "NOT_AVAILABLE" },
];

const experienceOptions = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
  { label: "Expert", value: "EXPERT" },
];

function getInitial(name, email) {
  const value = name || email || "F";
  return value.charAt(0).toUpperCase();
}

function getDisplayBio(profile, form) {
  if (form.bio) return form.bio;
  return `${profile?.name || "This freelancer"} is building their TrustOnes freelancer profile.`;
}

function buildForm(data) {
  const freelancerProfile = data?.freelancerProfile || {};

  return {
    phone: freelancerProfile.phone || "",
    location: freelancerProfile.location || "",
    availability: freelancerProfile.availability || "AVAILABLE",
    professionalTitle:
      freelancerProfile.professionalTitle || "Freelance Developer",
    bio: freelancerProfile.bio || "",
    experienceLevel: freelancerProfile.experienceLevel || "INTERMEDIATE",
    startingPrice:
      freelancerProfile.startingPrice === null ||
      freelancerProfile.startingPrice === undefined
        ? ""
        : String(freelancerProfile.startingPrice),
    skills: Array.isArray(freelancerProfile.skills)
      ? freelancerProfile.skills
      : [],
    portfolioLinks: Array.isArray(freelancerProfile.portfolioLinks)
      ? freelancerProfile.portfolioLinks
      : [],
    educationHighlight: freelancerProfile.educationHighlight || "",
  };
}

export default function FreelancerProfilePage() {
  const [profileData, setProfileData] = useState({
    profile: null,
    freelancerProfile: initialForm,
    stats: {
      trustScore: 70,
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalProposals: 0,
      pendingProposals: 0,
      acceptedProposals: 0,
      totalMilestones: 0,
      approvedMilestones: 0,
      revisionMilestones: 0,
      approvedEarningsDisplay: "₹0",
    },
    badges: [],
  });

  const [form, setForm] = useState(initialForm);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/freelancer/profile", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load freelancer profile.");
      }

      setProfileData(result.data);
      setForm(buildForm(result.data));
    } catch (error) {
      setErrorMessage(error.message || "Unable to load freelancer profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addSkill() {
    const skill = newSkill.trim();

    if (!skill) return;

    setForm((current) => {
      const exists = current.skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      );

      if (exists) return current;

      return {
        ...current,
        skills: [...current.skills, skill].slice(0, 20),
      };
    });

    setNewSkill("");
  }

  function removeSkill(skill) {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }));
  }

  function addPortfolioLink() {
    setForm((current) => ({
      ...current,
      portfolioLinks: [
        ...current.portfolioLinks,
        {
          label: "",
          url: "",
        },
      ].slice(0, 8),
    }));
  }

  function updatePortfolioLink(index, field, value) {
    setForm((current) => ({
      ...current,
      portfolioLinks: current.portfolioLinks.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  }

  function removePortfolioLink(index) {
    setForm((current) => ({
      ...current,
      portfolioLinks: current.portfolioLinks.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        phone: form.phone,
        location: form.location,
        availability: form.availability,
        professionalTitle: form.professionalTitle,
        bio: form.bio,
        experienceLevel: form.experienceLevel,
        startingPrice: form.startingPrice === "" ? null : Number(form.startingPrice),
        skills: form.skills,
        portfolioLinks: form.portfolioLinks,
        educationHighlight: form.educationHighlight,
      };

      const response = await fetch("/api/freelancer/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save freelancer profile.");
      }

      setProfileData(result.data);
      setForm(buildForm(result.data));
      setSuccessMessage("Profile saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to save freelancer profile.");
    } finally {
      setSaving(false);
    }
  }

  const profile = profileData.profile;
  const stats = profileData.stats || {};
  const badges = profileData.badges || [];

  const displayName = profile?.name || "Freelancer";
  const displayEmail = profile?.email || "No email available";
  const initial = getInitial(profile?.name, profile?.email);
  const publicTitle = form.professionalTitle || "Freelance Developer";
  const publicBio = getDisplayBio(profile, form);

  const workStats = useMemo(
    () => [
      {
        label: "Completed Jobs",
        value: stats.completedProjects || 0,
        icon: BriefcaseBusiness,
      },
      {
        label: "Trust Score",
        value: stats.trustScore || 70,
        icon: ShieldCheck,
      },
      {
        label: "Avg Rating",
        value: "New",
        icon: Star,
      },
      {
        label: "Earned",
        value: stats.approvedEarningsDisplay || "₹0",
        icon: IndianRupee,
      },
    ],
    [stats]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading freelancer profile...
          </p>
        </div>
      </div>
    );
  }

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
            Update your phone, location, skills, portfolio, availability,
            starting price, and client-facing profile details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </section>

      {(errorMessage || successMessage) && (
        <section
          className={`rounded-2xl border p-4 text-sm font-bold ${
            errorMessage
              ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
              : "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]"
          }`}
        >
          {errorMessage || successMessage}
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-[#eadfd2] bg-white/80 shadow-sm">
            <div className="h-28 bg-gradient-to-br from-[#35170f] to-[#7c341d]" />

            <div className="-mt-12 px-6 pb-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-[1.7rem] border-4 border-[#fffaf3] bg-[#35170f] shadow-xl">
                {profile?.image ? (
                  <img
                    src={profile.image}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-black text-[#f4b454]">
                    {initial}
                  </div>
                )}

                <button
                  type="button"
                  disabled
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-2xl bg-[#6f2e1c]/70 text-white shadow-lg"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black tracking-[-0.04em] text-[#24130c]">
                    {displayName}
                  </h2>

                  {profile?.emailVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#047857]">
                      <BadgeCheck size={13} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#fde68a] bg-[#fffbeb] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#b45309]">
                      <Mail size={13} />
                      Email Pending
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm font-bold text-[#6f2e1c]">
                  {publicTitle}
                </p>

                <p className="mt-3 text-sm leading-6 text-[#7c6858]">
                  {publicBio}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {workStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-[#fffaf3] p-4"
                    >
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
              portfolio, and value within a few seconds.
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
                  Account identity is fetched securely. Profile details below
                  are editable.
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
                  value={displayName}
                  readOnly
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none"
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
                    value={displayEmail}
                    readOnly
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none"
                  />

                  {profile?.emailVerified && (
                    <BadgeCheck size={17} className="text-[#047857]" />
                  )}
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
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Location
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <MapPin size={17} className="text-[#9b7a64]" />

                  <input
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="Bhubaneswar, Odisha"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Availability
                </span>

                <select
                  value={form.availability}
                  onChange={(event) =>
                    updateField("availability", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Joined On
                </span>

                <input
                  type="text"
                  value={profile?.joinedAtDisplay || "No date"}
                  readOnly
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none"
                />
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
                  This is what clients will see when they review your profile.
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
                  value={displayName}
                  readOnly
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Professional Title
                </span>

                <input
                  type="text"
                  value={form.professionalTitle}
                  onChange={(event) =>
                    updateField("professionalTitle", event.target.value)
                  }
                  placeholder="Full-stack Frontend Developer"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Experience Level
                </span>

                <select
                  value={form.experienceLevel}
                  onChange={(event) =>
                    updateField("experienceLevel", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {experienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
                    value={form.startingPrice}
                    onChange={(event) =>
                      updateField("startingPrice", event.target.value)
                    }
                    placeholder="5000"
                    min="0"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
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
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Tell clients what you build and why they should trust you."
                className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none focus:border-[#6f2e1c] placeholder:text-[#b79d88]"
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
                    Skills shown on your public freelancer card.
                  </p>
                </div>

                <PenLine size={20} className="text-[#6f2e1c]" />
              </div>

              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="rounded-full border border-[#eadfd2] bg-[#fffaf3] px-3 py-1.5 text-xs font-bold text-[#7c6858] transition hover:border-[#fecaca] hover:bg-[#fef2f2] hover:text-[#b91c1c]"
                  >
                    {skill} ×
                  </button>
                ))}

                {form.skills.length === 0 && (
                  <p className="text-sm font-semibold text-[#9b7a64]">
                    No skills added yet.
                  </p>
                )}
              </div>

              <div className="mt-5 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                <Sparkles size={17} className="text-[#9b7a64]" />

                <input
                  type="text"
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill..."
                  className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-[#6f2e1c] px-3 py-2 text-xs font-black text-white"
                >
                  Add
                </button>
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
                {form.portfolioLinks.map((link, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                        <Link2 size={17} />
                      </div>

                      <div className="grid flex-1 gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          value={link.label || ""}
                          onChange={(event) =>
                            updatePortfolioLink(
                              index,
                              "label",
                              event.target.value
                            )
                          }
                          placeholder="GitHub"
                          className="h-11 rounded-xl border border-[#eadfd2] bg-white px-3 text-sm font-semibold text-[#24130c] outline-none"
                        />

                        <input
                          type="text"
                          value={link.url || ""}
                          onChange={(event) =>
                            updatePortfolioLink(index, "url", event.target.value)
                          }
                          placeholder="github.com/username"
                          className="h-11 rounded-xl border border-[#eadfd2] bg-white px-3 text-sm font-semibold text-[#24130c] outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removePortfolioLink(index)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {form.portfolioLinks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-5 text-center">
                    <ExternalLink
                      size={20}
                      className="mx-auto text-[#6f2e1c]"
                    />
                    <p className="mt-2 text-sm font-semibold text-[#9b7a64]">
                      No portfolio links added yet.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={addPortfolioLink}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
              >
                <Plus size={17} />
                Add Portfolio Link
              </button>
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

            <input
              type="text"
              value={form.educationHighlight}
              onChange={(event) =>
                updateField("educationHighlight", event.target.value)
              }
              placeholder="B.Tech CSE student building scalable AI and SaaS products."
              className="h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c] placeholder:text-[#b79d88]"
            />
          </section>

          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Account Badges
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className={`rounded-2xl border p-5 ${
                    badge.active
                      ? "border-[#a7f3d0] bg-[#ecfdf5]"
                      : "border-[#eadfd2] bg-[#fffaf3]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {badge.active ? (
                      <BadgeCheck size={19} className="text-[#047857]" />
                    ) : (
                      <ShieldCheck size={19} className="text-[#9b7a64]" />
                    )}

                    <p
                      className={`text-sm font-black ${
                        badge.active ? "text-[#047857]" : "text-[#7c6858]"
                      }`}
                    >
                      {badge.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}