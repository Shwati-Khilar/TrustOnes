"use client";

import { freelancers } from "./FreelancerData";
import FreelancerCard from "./FreelancerCard";

export default function FreelancerGrid({
    freelancers,
}) {
    return (
        <div
            className="
      mt-8
      grid
      gap-6
      lg:grid-cols-3
      md:grid-cols-2
      grid-cols-1
    "
        >
            {freelancers.map((freelancer) => (
                <FreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                />
            ))}
        </div>
    );
}