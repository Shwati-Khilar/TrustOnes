export default function RecentProjects() {

  const projects = [
    {
      title: "E-Commerce Platform",
      status: "Active",
      budget: "₹12,000",
      freelancer: "Aman Sharma",
      progress: 72,
    },
    {
      title: "Logo Design",
      status: "Review",
      budget: "₹3,500",
      freelancer: "Priya Verma",
      progress: 95,
    },
    {
      title: "Mobile App MVP",
      status: "Active",
      budget: "₹22,000",
      freelancer: "Rohit Kumar",
      progress: 38,
    },
    {
      title: "SEO Strategy",
      status: "Open",
      budget: "₹4,000",
      freelancer: "-",
      progress: 0,
    },
    {
      title: "Backend API",
      status: "Completed",
      budget: "₹8,500",
      freelancer: "Akash Patel",
      progress: 100,
    },
  ];

  const statusStyles = {
    Active:
      "bg-green-50 text-green-700 border border-green-200",

    Review:
      "bg-yellow-50 text-yellow-700 border border-yellow-200",

    Open:
      "bg-blue-50 text-blue-700 border border-blue-200",

    Completed:
      "bg-[#F7F3EE] text-[#7A4A28] border border-[#E7DDD2]",
  };

  return (
    <div className="rounded-2xl bg-white border border-[#E7DDD2] overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between p-6">

        <div>
          <h2 className="text-xl font-semibold text-[#3D2414]">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-[#A09286]">
            {projects.length} total projects
          </p>
        </div>

        <button className="font-medium text-[#7A4A28] hover:text-[#5F381D]">
          View All →
        </button>

      </div>

      <div className="overflow-x-auto">

        <div className="min-w-[900px]">

          {/* Table Header */}

          <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr] border-t border-b border-[#EFE5DB] bg-[#FAF6F1] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#B88746]">

            <div>Project</div>
            <div>Status</div>
            <div>Budget</div>
            <div>Freelancer</div>
            <div>Progress</div>

          </div>

          {/* Rows */}

          {projects.map((project) => (
            <div
              key={project.title}
              className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr] items-center px-6 py-5 border-b border-[#F4ECE4] hover:bg-[#FCFAF7] transition"
            >

              {/* Project */}

              <div className="font-medium text-[#3D2414] truncate pr-4 text-sm">
                {project.title}
              </div>

              {/* Status */}

              <div className="pr-6">
                <span
                  className={`rounded-full px-4 py-1 text-sm ${statusStyles[project.status]}`}
                >
                  {project.status}
                </span>
              </div>

              {/* Budget */}

              <div className="font-medium text-[#3D2414] text-sm">
                {project.budget}
              </div>

              {/* Freelancer */}

              <div className="text-[#7A4A28] text-sm">
                {project.freelancer}
              </div>

              {/* Progress */}

              <div className="flex items-center gap-3">

                <div className="h-2 flex-1 rounded-full bg-[#ECE3D9]">

                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#C89B3C] to-[#8B5A2B]"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />

                </div>

                <span className="min-w-[40px] text-sm text-[#7A4A28]">
                  {project.progress}%
                </span>

              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}