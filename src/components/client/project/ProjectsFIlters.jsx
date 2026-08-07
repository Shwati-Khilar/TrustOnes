"use client";

import { Search } from "lucide-react";

export default function ProjectsFilters({
  searchTerm,
  setSearchTerm,
  activeStatus,
  setActiveStatus,
  totalProjects,
}) {
  const statuses = [
    "All",
    "Active",
    "Open",
    "Review",
    "Completed",
    "Paused",
  ];

  return (
    <div className="mt-8">

      <div className="flex items-center gap-4">

        {/* Search */}

        <div className="relative flex-1">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#B88746]
            "
          />

          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-[#E7DDD2]
              bg-white
              py-3
              pl-12
              pr-4
              text-[#3D2414]
              outline-none
            "
          />

        </div>

        {/* Status Pills */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-[#E7DDD2]
            bg-white
            px-3
            py-2
          "
        >
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() =>
                setActiveStatus(status)
              }
              className={`
                rounded-xl
                px-3
                py-1.5
                text-sm
                font-medium
                transition-all

                ${
                  activeStatus === status
                    ? "bg-[#8B5A2B] text-white"
                    : "text-[#B88746]"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort */}

        <div className="relative">

          <select
            className="
              appearance-none
              rounded-2xl
              border
              border-[#D8B16D]
              bg-white
              px-4
              py-3
              pr-10
              text-[#7A4A28]
              font-medium
              outline-none
              text-sm
            "
          >
            <option>Most Recent</option>
            <option>Budget: High</option>
            <option>Budget: Low</option>
            <option>Progress</option>
          </select>

          <span
            className="
              pointer-events-none
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-[#B88746]
            "
          >
            ▼
          </span>

        </div>

      </div>

      <p className="mt-6 text-md text-[#B88746]">
        Showing {totalProjects} projects
      </p>

    </div>
  );
}