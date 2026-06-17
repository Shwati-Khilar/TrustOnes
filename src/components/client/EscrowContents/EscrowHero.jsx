export default function EscrowHero() {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-[32px]
      bg-gradient-to-r
      from-[#8B5A2B]
      to-[#5E381C]
      p-6
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
          ESCROW MANAGEMENT
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          Escrow Centre
        </h1>

        <p className="mt-4 max-w-2xl text-[#EED8C7]">
          Every payment is secured in escrow.
          Release funds only when you are satisfied.
        </p>

        <div className="mt-8 flex gap-10 border-t border-white/10 pt-6">

          <div>
            <h3 className="text-2xl font-bold">$40K</h3>
            <p className="text-[#EED8C7]">Total Funded</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">$25K</h3>
            <p className="text-[#EED8C7]">Released</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">$10K</h3>
            <p className="text-[#EED8C7]">Locked</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">$5K</h3>
            <p className="text-[#EED8C7]">Disputed</p>
          </div>

        </div>
      </div>
    </div>
  );
}