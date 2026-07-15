"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  PenLine,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  UserRound,
  X,
} from "lucide-react";

const receivedReviews = [
  {
    id: "REV-001",
    client: "Cara Wilson",
    project: "TrustOnes Client Portal",
    rating: 5,
    date: "16 Jun 2026",
    comment:
      "Kushaagra delivered the dashboard polish with great attention to detail. Communication was clear and the milestone was completed on time.",
    tags: ["On-time", "Clear communication", "High quality"],
  },
  {
    id: "REV-002",
    client: "Ananya Studio",
    project: "Portfolio Website Redesign",
    rating: 4.8,
    date: "11 Jun 2026",
    comment:
      "Very professional work. The wireframes were structured well and revisions were handled smoothly.",
    tags: ["Professional", "Good design sense", "Responsive"],
  },
  {
    id: "REV-003",
    client: "MedLink Labs",
    project: "Healthcare Appointment UI",
    rating: 4.6,
    date: "05 Jun 2026",
    comment:
      "Good execution and strong frontend understanding. Some mobile spacing needed revision, but overall a reliable freelancer.",
    tags: ["Reliable", "Frontend skills", "Cooperative"],
  },
];

const pendingReviews = [
  {
    id: "PEN-001",
    client: "Rahul Mehta",
    project: "E-commerce Landing Page",
    completedOn: "15 Jun 2026",
    status: "Awaiting client review",
  },
  {
    id: "PEN-002",
    client: "Rohit Sharma",
    project: "Dispute Panel MVP",
    completedOn: "12 Jun 2026",
    status: "Review request sent",
  },
];

const reviewsGiven = [
  {
    id: "GIV-001",
    client: "Cara Wilson",
    project: "TrustOnes Client Portal",
    rating: 5,
    comment:
      "Clear requirements, quick feedback, and professional communication throughout the milestone.",
    date: "16 Jun 2026",
  },
  {
    id: "GIV-002",
    client: "Ananya Studio",
    project: "Portfolio Website Redesign",
    rating: 4.7,
    comment:
      "Good client to work with. Requirements were mostly clear and feedback was respectful.",
    date: "11 Jun 2026",
  },
];

const reviewBreakdown = [
  {
    label: "Communication",
    value: 96,
  },
  {
    label: "Delivery Quality",
    value: 94,
  },
  {
    label: "On-time Work",
    value: 91,
  },
  {
    label: "Revision Handling",
    value: 89,
  },
];

function Stars({ rating }) {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={16}
          className={
            index < fullStars
              ? "fill-[#f4b454] text-[#f4b454]"
              : "text-[#d7c3b2]"
          }
        />
      ))}

      <span className="ml-2 text-sm font-black text-[#24130c]">
        {rating}
      </span>
    </div>
  );
}

export default function FreelancerReviewsPage() {
  const [showModal, setShowModal] = useState(false);

  const averageRating = useMemo(() => {
    const total = receivedReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / receivedReviews.length).toFixed(1);
  }, []);

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Reviews
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Build trust through verified project feedback.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Track client reviews, your public trust score, pending feedback, and
            reviews you have given to clients after completed work.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <PenLine size={18} />
          Review a Client
        </button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f4b454]">
                Public Trust Score
              </p>

              <div className="mt-5 flex items-end gap-3">
                <h2 className="text-6xl font-black tracking-[-0.08em]">
                  94
                </h2>
                <p className="pb-2 text-sm font-bold text-white/55">/100</p>
              </div>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                Strong profile based on client ratings, completed milestones,
                clean dispute history, and consistent delivery behavior.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">
                Avg Rating
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Star size={20} className="fill-[#f4b454] text-[#f4b454]" />
                <p className="text-3xl font-black">{averageRating}</p>
              </div>
              <p className="mt-1 text-xs font-semibold text-white/55">
                From {receivedReviews.length} reviews
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-black">18</p>
              <p className="mt-1 text-xs font-semibold text-white/55">
                Completed jobs
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-black">0</p>
              <p className="mt-1 text-xs font-semibold text-white/55">
                Lost disputes
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-black">96%</p>
              <p className="mt-1 text-xs font-semibold text-white/55">
                Client satisfaction
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Review Breakdown
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                What your score is built from
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
              <Sparkles size={21} />
            </div>
          </div>

          <div className="space-y-5">
            {reviewBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-black text-[#24130c]">
                    {item.label}
                  </p>
                  <p className="text-sm font-black text-[#6f2e1c]">
                    {item.value}%
                  </p>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[#eadfd2]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#a7f3d0] bg-[#ecfdf5] p-4">
            <div className="flex gap-3">
              <ShieldCheck size={19} className="shrink-0 text-[#047857]" />
              <p className="text-sm leading-6 text-[#047857]">
                Reviews should only be created after a completed milestone or
                completed project. This keeps the trust score reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Reviews Received
            </h2>
            <p className="mt-1 text-sm font-medium text-[#9b7a64]">
              Feedback from clients after completed work.
            </p>
          </div>

          <div className="space-y-4">
            {receivedReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[1.6rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Stars rating={review.rating} />
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                          {review.id}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#24130c]">
                        {review.client}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                        {review.project}
                      </p>

                      <p className="mt-4 max-w-3xl text-sm leading-6 text-[#7c6858]">
                        “{review.comment}”
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-xs font-bold text-[#b79d88]">
                    {review.date}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {review.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#eadfd2] bg-white px-3 py-1.5 text-xs font-bold text-[#7c6858]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Pending Reviews
            </h2>

            <div className="mt-5 space-y-3">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[#fffbeb] bg-[#fffbeb] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#b45309]">
                      Pending
                    </span>

                    <Clock3 size={17} className="text-[#b45309]" />
                  </div>

                  <h3 className="text-sm font-black text-[#24130c]">
                    {review.client}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                    {review.project}
                  </p>

                  <p className="mt-3 text-xs font-bold text-[#b79d88]">
                    Completed on {review.completedOn}
                  </p>

                  <p className="mt-2 text-sm leading-5 text-[#7c6858]">
                    {review.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ThumbsUp size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Review fairly.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Your review of clients helps future freelancers understand how
              clear, respectful, and payment-reliable a client is.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Review only completed work",
                "Mention communication quality",
                "Mention requirement clarity",
                "Avoid emotional or abusive language",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-[#f4b454]" />
                  <p className="text-sm font-semibold text-white/78">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Reviews Given to Clients
            </h2>
            <p className="mt-1 text-sm font-medium text-[#9b7a64]">
              Your feedback helps build client trust history.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
          >
            <PenLine size={17} />
            Write Review
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {reviewsGiven.map((review) => (
            <article
              key={review.id}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Stars rating={review.rating} />

                  <h3 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#24130c]">
                    {review.client}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                    {review.project}
                  </p>
                </div>

                <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm">
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#7c6858]">
                “{review.comment}”
              </p>

              <p className="mt-3 text-xs font-bold text-[#b79d88]">
                {review.date}
              </p>
            </article>
          ))}
        </div>
      </section>

      {showModal && <ReviewClientModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ReviewClientModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120905]/55 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
              Client Review
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#24130c]">
              Review your client
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7c6858]">
              This feedback will help future freelancers understand client
              behavior, clarity, and payment reliability.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-5">
          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Completed Project
            </span>

            <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
              <option>TrustOnes Client Portal - Cara Wilson</option>
              <option>Portfolio Website Redesign - Ananya Studio</option>
              <option>Healthcare Appointment UI - MedLink Labs</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-[#24130c]">
                Communication Rating
              </span>

              <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                <option>5 - Excellent</option>
                <option>4 - Good</option>
                <option>3 - Average</option>
                <option>2 - Poor</option>
                <option>1 - Very Poor</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-black text-[#24130c]">
                Payment Behavior
              </span>

              <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                <option>5 - Very Reliable</option>
                <option>4 - Reliable</option>
                <option>3 - Average</option>
                <option>2 - Delayed</option>
                <option>1 - Problematic</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Requirement Clarity
            </span>

            <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
              <option>5 - Very Clear</option>
              <option>4 - Mostly Clear</option>
              <option>3 - Somewhat Clear</option>
              <option>2 - Unclear</option>
              <option>1 - Very Unclear</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Written Review
            </span>

            <textarea
              rows={5}
              placeholder="Write a fair, professional review of your working experience with this client."
              className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
            />
          </label>

          <div className="rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-4">
            <div className="flex gap-3">
              <MessageSquareText
                size={18}
                className="shrink-0 text-[#b45309]"
              />

              <p className="text-sm leading-6 text-[#92400e]">
                Keep your review factual. Avoid personal attacks. Focus on
                communication, payment behavior, clarity, and professionalism.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
            >
              Cancel
            </button>

            <button
              type="button"
              className="h-12 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}