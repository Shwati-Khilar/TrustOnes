export default function ProjectSummaryCard({ formData }) {
  return (
    <div className="bg-white border border-[#E9D8C8] rounded-3xl p-8 h-fit sticky top-28">

      <h2 className="text-2xl font-semibold text-[#2B1A12] mb-8">
        Project Summary
      </h2>

      <div className="space-y-6">

        <Summary title="Status" value="OPEN" />

        <Summary
          title="Category"
          value={formData.category || "Not Selected"}
        />

        <Summary
          title="Budget"
          value={formData.budget ? `₹${Number(formData.budget).toLocaleString("en-IN")}` : "₹0"}
        />

        <Summary
          title="Deadline"
          value={formData.deadline || "Not Selected"}
        />

        <Summary
          title="Project Title"
          value={formData.title || "Untitled Project"}
        />

      </div>

    </div>
  );
}

function Summary({ title, value }) {
  return (
    <div className="border-b border-[#F2E7DB] pb-4 last:border-none last:pb-0">
      <p className="text-sm text-[#A77442]">{title}</p>

      <p className="mt-1 text-lg font-semibold text-[#2B1A12] break-words">
        {value}
      </p>
    </div>
  );
}