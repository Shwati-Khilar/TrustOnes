export default function FreelancerHero() {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-[32px]
      bg-gradient-to-r
      from-[#8B5A2B]
      to-[#5E381C]
      p-10
      text-white
    "
    >
      <div className="relative z-10">
        <span
          className="
          inline-flex
          rounded-full
          bg-[#A06B36]
          px-4
          py-2
          text-sm
          font-medium
          text-[#FFD35A]
        "
        >
          VERIFIED TALENT
        </span>

        <h1 className="text-5xl font-bold">
          Browse Freelancers
        </h1>

        <p className="mt-5 max-w-3xl text-xl text-[#EED8C7]">
          Every freelancer on TrustOnes is identity-verified and trust-scored.
          Hire with confidence through escrow-protected projects.
        </p>

        <div className="mt-10 grid grid-cols-4 gap-10 border-t border-white/10 pt-8">
          <div>
            <h3 className="text-3xl font-bold">12,400+</h3>
            <p className="text-[#EED8C7]">
              Verified Freelancers
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">96%</h3>
            <p className="text-[#EED8C7]">
              Client Satisfaction
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">48hr</h3>
            <p className="text-[#EED8C7]">
              Avg. Response Time
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">$0</h3>
            <p className="text-[#EED8C7]">
              Dispute Risk With Escrow
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/5" />
      <div className="absolute right-16 top-12 h-48 w-48 rounded-full bg-white/5" />
    </div>
  );
}2