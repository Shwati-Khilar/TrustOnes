export default function AssignedFreelancerCard({
  project,
  acceptedProposal,
}) {
  if (!project.freelancer || !acceptedProposal) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-[#eadfd2] bg-white p-7">

      <h2 className="text-2xl font-semibold text-[#24130c]">
        Assigned Freelancer
      </h2>

      <p className="mt-2 text-[#806049]">
        This freelancer has been selected for this project.
      </p>

      <div className="mt-6 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6f2e1c] text-xl font-semibold text-white">
            {project.freelancer.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#24130c]">
              {project.freelancer.name}
            </h3>

            <p className="text-sm text-[#806049]">
              {project.freelancer.email}
            </p>
          </div>

        </div>

        <div className="text-right">

          <p className="text-sm text-[#806049]">
            Accepted Bid
          </p>

          <p className="text-lg font-semibold text-[#24130c]">
            ₹{Number(acceptedProposal.bidAmount).toLocaleString("en-IN")}
          </p>

          <p className="mt-2 text-sm text-[#806049]">
            Delivery
          </p>

          <p className="font-medium text-[#24130c]">
            {acceptedProposal.estimatedDays} days
          </p>

        </div>

      </div>

    </section>
  );
}