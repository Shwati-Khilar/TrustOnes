"use client";

import { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    CheckCircle,
} from "lucide-react";

const tagClass = "px-3 py-2 rounded-xl bg-[#F7F3EE] text-[#B88746] text-sm";

export default function ProjectCard({ project }) {
    const [showMilestones, setShowMilestones] = useState(false);
    return (
        <div className="rounded-2xl bg-white border border-[#E7DDD2] p-5">

            {/* Header */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#3D2414] py-2">
                        {project.title}
                    </h2>

                    <p className="mt-3 text-[#B88746] text-sm">
                        {project.description}
                    </p>
                </div>

                <span
                    className="
          px-3 py-2
          rounded-full
          text-sm
          border
          border-[#E7DDD2]
          bg-[#F7F3EE]
          text-[#8B5A2B]
          whitespace-nowrap
        "
                >
                    {project.status}
                </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5 text-sm">
                <span className={tagClass}>
                    📁 {project.category}
                </span>

                <span className={tagClass}>
                    📅 {project.deadline}
                </span>

                <span className={tagClass}>
                    🛡️ Escrow Funded
                </span>
            </div>

            {/* Progress */}
            <div className="mt-4">
                <div className="flex justify-between mb-2 text-sm">
                    <span className="text-[#8B5A2B]">
                        Progress
                    </span>

                    <span className="font-medium text-[#8B5A2B]">
                        {project.progress}%
                    </span>
                </div>

                <div className="h-2 bg-[#EFE5DB] rounded-full">
                    <div
                        className="h-2 rounded-full bg-[#C58A1D]"
                        style={{
                            width: `${project.progress}%`,
                        }}
                    />
                </div>
            </div>

            {/* Budget Section */}
            <div
                className="
        mt-4
        grid
        grid-cols-3
        rounded-2xl
        border
        border-[#E7DDD2]
        p-4
        text-center
      "
            >
                <div>
                    <p className="text-[#B88746] text-sm">
                        Budget
                    </p>

                    <h3 className="font-bold text-[#3D2414] text-md">
                        ₹{project.budget}
                    </h3>
                </div>

                <div>
                    <p className="text-[#B88746] text-sm">
                        Spent
                    </p>

                    <h3 className="font-bold text-[#3D2414] text-md">
                        ₹{project.spent}
                    </h3>
                </div>

                <div>
                    <p className="text-[#B88746] text-sm">
                        Remaining
                    </p>

                    <h3 className="font-bold text-green-600 text-md">
                        ₹{project.budget - project.spent}
                    </h3>
                </div>
            </div>

            {/* Freelancer */}
            <div
                className="
        mt-4
        border
        border-[#E7DDD2]
        rounded-2xl
        p-4
        flex
        items-center
        justify-between
      "
            >
                <div className="flex items-center gap-3">

                    <div
                        className="
            h-10
            w-10
            rounded-full
            bg-[#8B5A2B]
            text-white
            flex
            items-center
            justify-center
            font-semibold
          "
                    >
                        {project.freelancer?.charAt(0) || "F"}
                    </div>

                    <div>
                        <h4 className="font-medium text-[#3D2414] text-md">
                            {project.freelancer}
                        </h4>

                        <p className="text-[#B88746] text-sm">
                            ⭐ {project.rating}
                        </p>
                    </div>

                </div>

                <button className="text-[#8B5A2B] font-medium hover:underline text-xs flex items-center gap-1">
                    <span>Message</span>
                    <span className="text-[10px]">→</span>
                </button>
            </div>

            {/* Milestones */}
            <div className="mt-4">

                <button
                    onClick={() =>
                        setShowMilestones(!showMilestones)
                    }
                    className="
      w-full
      flex
      items-center
      justify-between
      text-[#8B5A2B]
      font-semibold
    "
                >
                    <span>
                        🎯 Milestones (
                        {project.completedMilestones}/
                        {project.totalMilestones} done)
                    </span>

                    {showMilestones ? (
                        <ChevronUp size={15} />
                    ) : (
                        <ChevronDown size={15} />
                    )}
                </button>

                {showMilestones && (
                    <div className="mt-4 space-y-3">

                        {project.milestones?.map(
                            (milestone, index) => (
                                <div
                                    key={index}
                                    className="
              flex
              items-center
              gap-3
            "
                                >

                                    {milestone.completed ? (
                                        <CheckCircle
                                            size={15}
                                            className="text-green-500"
                                        />
                                    ) : (
                                        <div
                                            className="
                  h-4
                  w-4
                  rounded-full
                  border-2
                  border-[#D8C9B8]
                "
                                        />
                                    )}

                                    <span
                                        className={
                                            milestone.completed
                                                ? "line-through text-[#B88746] text-sm"
                                                : "text-[#3D2414] text-sm"
                                        }
                                    >
                                        {milestone.title}
                                    </span>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">

                <button
                    className="
          flex-1
          rounded-2xl
          bg-[#8B5A2B]
          py-2
          text-white
          font-medium
          hover:bg-[#6D4120]
          transition-colors

        "
                >
                    View Details
                </button>

                {project.status === "Open" && (
                    <button
                        className="
            rounded-2xl
            border
            border-[#8B5A2B]
            px-5
            text-[#8B5A2B]
            hover:bg-[#F7F3EE]
            transition-colors
          "
                    >
                        Fund Escrow
                    </button>
                )}

            </div>

        </div>
    );
}