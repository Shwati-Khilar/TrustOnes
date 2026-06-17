"use client";

import { Search } from "lucide-react";

import Link from "next/link";
const categories = [
    "All",
    "Development",
    "Design",
    "Marketing",
    "Writing",
    "Data & AI",
];

export default function FreelancerFilters({
    selectedCategory,
    setSelectedCategory,
    totalFreelancers,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
}) {
    return (
        <div className="mt-8">
            <div className="flex gap-4 items-center">
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
                        placeholder="Search by name, skill, or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
      w-full
      rounded-2xl
      border
      border-[#E7DDD2]
      bg-white
      py-4
      pl-12
      pr-4
      text-[#3D2414]
      outline-none
      focus:border-[#8B5A2B]
    "
                    />
                </div>


                <div className="relative">

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="
      min-w-[220px]
      rounded-2xl
      border
      border-[#E7DDD2]
      bg-white
      px-5
      py-4
      pr-12
      text-[#8B5A2B]
      font-medium
      outline-none
      appearance-none
      cursor-pointer
      hover:bg-[#eeeae5]
      transition-colors
    "
                    >
                        <option value="trust">Sort By</option>
                        <option value="trust">Trust Score</option>
                        <option value="rating">Highest Rated</option>
                        <option value="jobs">Most Jobs</option>
                        <option value="rateLow">Lowest Rate</option>
                        <option value="rateHigh">Highest Rate</option>
                    </select>

                    <span
                        className="
      absolute
      right-5
      top-1/2
      -translate-y-1/2
      text-[#B88746]
      pointer-events-none
      text-xs
    "
                    >
                        ▼
                    </span>

                </div>
            </div>


            <div className="mt-6 flex flex-wrap gap-3">
                {categories.map((item) => (
                    <button
                        key={item}
                        onClick={() => setSelectedCategory(item)}
                        className={`rounded-2xl border px-5 py-3 text-sm transition-all

      ${selectedCategory === item
                                ? "bg-[#8B5A2B] text-white border-[#8B5A2B]"
                                : "bg-white border-[#E7DDD2] text-[#8B5A2B]"
                            }
    `}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <p className="mt-6 text-lg text-[#B88746]">
                Showing {totalFreelancers} result{totalFreelancers !== 1 ? "s" : ""}
            </p>
        </div>
    );
}