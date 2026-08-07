export default function ProjectsStats({
  projects,
  activeStatus,
  setActiveStatus,
}) {
  const cards = [
    {
      label: "Active",
      status: "ACTIVE",
    },
    {
      label: "Open",
      status: "OPEN",
    },
    {
      label: "Completed",
      status: "COMPLETED",
    },
    {
      label: "Paused",
      status: "PAUSED",
    },
    {
      label: "Cancelled",
      status: "CANCELLED",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-5 gap-4">
      {cards.map((card) => {
        const count = projects.filter(
          (project) => project.status === card.status
        ).length;

        return (
          <button
            key={card.status}
            onClick={() => setActiveStatus(card.label)}
            className={`
              rounded-2xl
              border
              p-5
              text-center
              transition-all

              ${
                activeStatus === card.label
                  ? "border-[#D8B16D] bg-[#FFFDF7] shadow-sm"
                  : "border-[#E7DDD2] bg-white"
              }
            `}
          >
            <h2 className="text-2xl font-bold text-[#8B5A2B]">
              {count}
            </h2>

            <p className="mt-2 text-[#8B5A2B]">
              {card.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}