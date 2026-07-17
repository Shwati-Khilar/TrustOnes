export default function DisputeHero() {
  return (
    <div
      className="
      rounded-3xl
      bg-gradient-to-r
      from-[#6F4121]
      to-[#8B5A2B]
      p-8
      text-white
      flex
      justify-between
      items-center
    "
    >
      <div>
        <span
          className="
          inline-block
          px-4
          py-1
          rounded-full
          bg-[#A36A39]
          text-xs
          font-medium
        "
        >
          DISPUTE MANAGEMENT
        </span>

        <h1 className="text-3xl font-bold mt-4">
          Disputes Centre
        </h1>

        <p className="mt-3 text-md text-[#F5E6D4] max-w-2xl">
          Raise, track and resolve project disputes with
          secure evidence submission and admin review.
        </p>
      </div>

      <button
        className="
        px-5
        py-3
        rounded-2xl
        bg-[#FFC62E]
        text-[#3D2414]
        font-semibold
      "
      >
        + Raise Dispute
      </button>
    </div>
  );
}