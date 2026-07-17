export default function ProjectsHero({ projects }) {
  const totalProjects = projects.length;

  const totalBudget = projects.reduce(
    (sum, project) => sum + Number(project.budget),
    0
  );
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-[32px]
      bg-gradient-to-r
      from-[#8B5A2B]
      to-[#5E381C]
      p-7
      text-white
    "
    >
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
        PROJECT MANAGEMENT
      </span>

      <h1 className="mt-5 text-3xl font-bold">
        Your Projects
      </h1>

      <p className="mt-4 text-md text-[#EED8C7]">
        Track milestones, manage freelancers and
        monitor progress from one place.
      </p>

      <div className="mt-10 grid grid-cols-4 gap-8 border-t border-white/10 pt-8">
        <div>
          <h3 className="text-2xl font-bold">{totalProjects}</h3>
          <p>Total Projects</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">
            ₹{totalBudget.toLocaleString("en-IN")}
          </h3>
          <p>Total Budget</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">₹32K</h3>
          <p>Total Spent</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">67%</h3>
          <p>Avg Progress</p>
        </div>
      </div>
    </div>
  );
}