export default function StatsCards() {
  const stats = [
    {
      title: "Active Projects",
      value: "0",
      subtitle: "Currently in progress",
    },
    {
      title: "Open Projects",
      value: "0",
      subtitle: "Awaiting proposals",
    },
    {
      title: "Hired Freelancers",
      value: "0",
      subtitle: "Trusted professionals",
    },
    {
      title: "Pending Actions",
      value: "0",
      subtitle: "Require attention",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="
            rounded-3xl
            bg-white
            border
            border-[#E7DDD2]
            p-6
            transition-all
            hover:border-[#C89B3C]
            hover:-translate-y-1
          "
        >
          <p className="text-sm text-[#7A7068]">
            {item.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#3D2414]">
            {item.value}
          </h2>

          <p className="mt-2 text-xs text-[#A09286]">
            {item.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}