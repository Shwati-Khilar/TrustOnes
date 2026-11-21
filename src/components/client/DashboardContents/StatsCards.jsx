export default function StatsCards() {
  const stats = [
    {
      title: "Active Projects",
      value: "3",
      subtitle: "Currently in progress",
    },
    {
      title: "Open Projects",
      value: "1",
      subtitle: "Awaiting proposals",
    },
    {
      title: "Hired Freelancers",
      value: "4",
      subtitle: "Trusted professionals",
    },
    {
      title: "Pending Actions",
      value: "4",
      subtitle: "Require attention",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="
            rounded-3xl
            bg-white
            border
            border-[#eadfd2]
            p-5
            transition-all
            hover:border-[#C89B3C]
            hover:-translate-y-1
          "
        >
          <p className="text-sm text-[#7A7068]">
            {item.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#24130c]">
            {item.value}
          </h2>

          <p className="mt-2 text-xs text-[#806049]">
            {item.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}