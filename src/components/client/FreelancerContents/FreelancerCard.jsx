export default function FreelancerCard({ freelancer }) {
  return (
    <div className="rounded-3xl border border-[#E7DDD2] bg-white p-5 hover:shadow-md transition">

      <div className="flex items-start gap-4">

        <div className="h-14 w-14 rounded-2xl bg-[#F5EBDD] flex items-center justify-center text-xl font-bold text-[#7A4A28]">
          {freelancer.name.charAt(0)}
        </div>

        <div className="flex-1">

          <div className="flex items-center gap-2 flex-wrap">

            <h3 className="font-semibold text-[#3D2414]">
              {freelancer.name}
            </h3>

            <span className="rounded-full bg-[#F7F3EE] px-3 py-1 text-xs text-[#B88746]">
              {freelancer.badge}
            </span>

          </div>

          <p className="text-[#B88746]">
            {freelancer.title}
          </p>

          <p className="text-sm text-[#9B8A79]">
            {freelancer.location}
          </p>

        </div>

      </div>

      <div className="mt-4 flex flex-wrap gap-2">

        {freelancer.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg border border-[#EFE5DB] px-3 py-1 text-sm text-[#8B5A2B]"
          >
            {skill}
          </span>
        ))}

      </div>

      <div className="mt-4">

        <div className="mb-2 flex justify-between">

          <span className="text-[#8B5A2B]">
            Trust Score
          </span>

          <span className="font-medium text-[#3D2414]">
            {freelancer.trustScore}/100
          </span>

        </div>

        <div className="h-2 rounded-full bg-[#EFE5DB]">

          <div
            className="h-2 rounded-full bg-[#C58A2A]"
            style={{
              width: `${freelancer.trustScore}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-4 flex items-center justify-between">

        <div className="text-[#8B5A2B]">
          ⭐ {freelancer.rating}
        </div>

        <div className="text-[#8B5A2B]">
          {freelancer.jobs} jobs
        </div>

        <div className="text-[#8B5A2B]">
          ₹{freelancer.rate}/hr
        </div>

      </div>

      <div className="mt-4 flex gap-3">

        <button className="flex-1 rounded-xl bg-[#8B5A2B] py-3 text-white hover:bg-[#6E4523]">
          View Profile
        </button>

        <button className="rounded-xl border border-[#E7DDD2] px-4 py-3 text-[#8B5A2B] hover:bg-[#F7F3EE]">
          Invite
        </button>

      </div>

    </div>
  );
}