import React from "react";
import Link from "next/link";
export default function RecommendedFreelancers() {

  const freelancers = [
    {
      name: "Ada Chen",
      role: "Full-Stack Developer",
      score: 98,
      rating: 4.9,
      reviews: 142,
      badge: "TOP RATED",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    {
      name: "Marco Rivera",
      role: "Brand & Visual Designer",
      score: 94,
      rating: 4.8,
      reviews: 97,
      badge: "VERIFIED PRO",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    },
    {
      name: "Priya Nair",
      role: "Mobile App Developer",
      score: 91,
      rating: 4.7,
      reviews: 63,
      badge: "RISING TALENT",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    },
  ];

  return (
    <div className="mt-8 rounded-3xl border border-[#E7DDD2] bg-white p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#3D2414]">
            Recommended Freelancers
          </h2>

          <p className="mt-1 text-sm text-[#B88746]">
            Based on your project needs
          </p>
        </div>

        <Link
          href="/client/freelancers"
          className="text-[#8B5A2B] hover:text-[#6D4325] text-sm font-medium"
        >
          Browse Talent →
        </Link>

      </div>

      {/* Cards */}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">

        {freelancers.map((freelancer) => (
          <div
            key={freelancer.name}
            className="
              rounded-3xl
              border
              border-[#E7DDD2]
              p-6
              transition-all
              hover:border-[#D7B98D]
              hover:shadow-sm
            "
          >

            {/* Profile */}

            <div className="flex items-center gap-4">

              <img
                src={freelancer.image}
                alt={freelancer.name}
                className="
                  h-14
                  w-14
                  rounded-2xl
                  object-cover
                  border
                  border-[#E7DDD2]
                "
              />

              <div>
                <h3 className="text-md font-medium text-[#3D2414]">
                  {freelancer.name}
                </h3>

                <p className="text-[#C58A42] text-sm font-medium">
                  {freelancer.role}
                </p>
              </div>

            </div>

            {/* Badge */}

            <div className="mt-6">

              <span
                className="
                  rounded-full
                  bg-[#F7F1E8]
                  px-3
                  py-1
                  text-xs
                  tracking-wide
                  text-[#B36F1B]
                "
              >
                {freelancer.badge}
              </span>

            </div>

            {/* Trust Score */}

            <div className="mt-6">

              <div className="flex justify-between text-[#8B5A2B] text-sm font-medium">

                <span>Trust Score</span>

                <span>{freelancer.score}/100</span>

              </div>

              <div className="mt-3 h-2 rounded-full bg-[#EFE5DB]">

                <div
                  className="
                    h-2
                    rounded-full
                    bg-gradient-to-r
                    from-[#A5682A]
                    via-[#C78A2B]
                    to-[#F1B61C]
                  "
                  style={{
                    width: `${freelancer.score}%`,
                  }}
                />

              </div>

            </div>

            {/* Footer */}

            <div className="mt-6 flex items-center justify-between">

              <div className="text-[#C58A42] text-sm font-medium">

                ⭐ {freelancer.rating}
                <span className="ml-1 text-[#B88746]">
                  ({freelancer.reviews})
                </span>

              </div>

              <button
                className="
                  rounded-xl
                  bg-[#8B5A2B]
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                  hover:bg-[#6D4325]
                "
              >
                View Profile
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}