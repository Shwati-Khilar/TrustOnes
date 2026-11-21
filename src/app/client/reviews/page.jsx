import Link from "next/link";
import { Star, Users, ShieldCheck } from "lucide-react";

const reviews = [
  {
    id: "r1",
    freelancer: "Ada Chen",
    project: "E-Commerce Platform",
    rating: 5,
    date: "12 Nov 2026",
    text: "Clear requirements, fast milestone approvals, and escrow was funded before work started. Great client to work with.",
  },
  {
    id: "r2",
    freelancer: "Priya Verma",
    project: "Logo Design",
    rating: 5,
    date: "4 Nov 2026",
    text: "Shared detailed brand notes and gave feedback within a day. Payment released immediately after approval.",
  },
  {
    id: "r3",
    freelancer: "Rohit Kumar",
    project: "Mobile App MVP",
    rating: 4,
    date: "26 Oct 2026",
    text: "Smooth project overall. Scope changed once but we re-agreed milestones without any dispute.",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-[#f4b454]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          fill={index < rating ? "currentColor" : "none"}
          className={index < rating ? "" : "text-[#d7c3b2]"}
        />
      ))}
    </div>
  );
}

export default function ClientReviewsPage() {
  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
          Reputation
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
          Reviews from freelancers
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
          Feedback left by freelancers after completed milestones. A strong
          record helps you attract the best talent.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">Average rating</p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
            {average.toFixed(1)}
          </h3>

          <p className="mt-3 text-xs font-semibold text-[#7c6858]">
            Across {reviews.length} reviews
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">Freelancers hired</p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
            4
          </h3>

          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#7c6858]">
            <Users size={13} />
            Trusted professionals
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">Disputes</p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
            0
          </h3>

          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#047857]">
            <ShieldCheck size={13} />
            Clean record
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
        <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
          Latest reviews
        </h2>

        <div className="mt-5 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-[#24130c]">
                    {review.freelancer}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-[#7c6858]">
                    {review.project} • {review.date}
                  </p>
                </div>

                <Stars rating={review.rating} />
              </div>

              <p className="mt-3 text-sm leading-6 text-[#7c6858]">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/client/freelancers"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
        >
          Hire more talent
        </Link>
      </div>
    </div>
  );
}
