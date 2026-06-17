export default function ProjectsStats({
  activeStatus,
  setActiveStatus,
}) {
  const cards = [
    {
      count: 2,
      label: "Active",
    },
    {
      count: 1,
      label: "Open",
    },
    {
      count: 1,
      label: "Review",
    },
    {
      count: 1,
      label: "Completed",
    },
    {
      count: 1,
      label: "Paused",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-5 gap-4">

      {cards.map((card) => (
        <button
          key={card.label}
          onClick={() =>
            setActiveStatus(card.label)
          }
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
            {card.count}
          </h2>

          <p className="mt-2 text-[#8B5A2B]">
            {card.label}
          </p>
        </button>
      ))}

    </div>
  );
}