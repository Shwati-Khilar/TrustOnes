"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CreateMilestoneModal from "@/components/client/project/CreateMilestoneModel";
import EditMilestonesModel from "@/components/client/project/EditMilestonesModel";
import AssignedFreelancerCard from "@/components/client/project/AssignedFreelancerCard";

export default function ProjectDetailsPage({ params }) {
  const { projectId } = use(params);
  const router = useRouter();

  // Project state
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancel project state
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // Proposal state
  const [proposals, setProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(true);
  const [proposalsError, setProposalsError] = useState("");

  const [acceptingProposalId, setAcceptingProposalId] =
    useState(null);

  const [acceptProposalError, setAcceptProposalError] =
    useState("");

  // Milestone state
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] =
    useState(true);

  const [milestonesError, setMilestonesError] =
    useState("");

  // Create milestone modal
  const [showCreateMilestone, setShowCreateMilestone] =
    useState(false);

  const [editingMilestone, setEditingMilestone] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/projects/${projectId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch project."
          );
        }

        setProject(data.project);
      } catch (error) {
        console.error("FETCH_PROJECT_ERROR", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);



  useEffect(() => {
    async function fetchProposals() {
      try {
        setProposalsLoading(true);
        setProposalsError("");

        const response = await fetch(
          `/api/projects/${projectId}/proposals`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch proposals."
          );
        }

        setProposals(data.proposals);
      } catch (error) {
        console.error("FETCH_PROPOSALS_ERROR", error);
        setProposalsError(error.message);
      } finally {
        setProposalsLoading(false);
      }
    }

    fetchProposals();
  }, [projectId]);



  useEffect(() => {
    async function fetchMilestones() {
      try {
        setMilestonesLoading(true);
        setMilestonesError("");

        const response = await fetch(
          `/api/projects/${projectId}/milestones`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch milestones."
          );
        }

        setMilestones(data.milestones);
      } catch (error) {
        console.error("FETCH_MILESTONES_ERROR", error);
        setMilestonesError(error.message);
      } finally {
        setMilestonesLoading(false);
      }
    }

    fetchMilestones();
  }, [projectId]);



  async function handleCancelProject() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this project? This action cannot be undone."
    );

    if (!confirmed || cancelling) {
      return;
    }

    try {
      setCancelling(true);
      setCancelError("");

      const response = await fetch(
        `/api/projects/${projectId}/cancel`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel project."
        );
      }

      setProject(data.project);
    } catch (error) {
      console.error("CANCEL_PROJECT_ERROR", error);
      setCancelError(error.message);
    } finally {
      setCancelling(false);
    }
  }



  async function handleAcceptProposal(proposalId) {
    const confirmed = window.confirm(
      "Accept this proposal and assign the freelancer to this project?"
    );

    if (!confirmed || acceptingProposalId) {
      return;
    }

    try {
      setAcceptingProposalId(proposalId);
      setAcceptProposalError("");

      const response = await fetch(
        `/api/proposals/${proposalId}/accept`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to accept proposal."
        );
      }

      // Project becomes ACTIVE and receives freelancer
      setProject(data.project);

      // Update proposal statuses locally
      setProposals((currentProposals) =>
        currentProposals.map((proposal) => {
          if (proposal.id === proposalId) {
            return {
              ...proposal,
              status: "ACCEPTED",
            };
          }

          if (proposal.status === "PENDING") {
            return {
              ...proposal,
              status: "REJECTED",
            };
          }

          return proposal;
        })
      );
    } catch (error) {
      console.error("ACCEPT_PROPOSAL_ERROR", error);
      setAcceptProposalError(error.message);
    } finally {
      setAcceptingProposalId(null);
    }
  }
  async function handleDeleteMilestone(milestoneId) {
    const confirmed = window.confirm(
      "Delete this milestone? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/milestones/${milestoneId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMilestones((current) =>
        current.filter((m) => m.id !== milestoneId)
      );
    } catch (error) {
      alert(error.message);
    }
  }
  async function handleFundMilestone(milestoneId) {
    const confirmed = window.confirm(
      "Record simulated funding for this milestone? No money will be transferred."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/milestones/${milestoneId}/fund`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fund milestone."
        );
      }

      setMilestones((current) =>
        current.map((milestone) =>
          milestone.id === milestoneId
            ? data.milestone
            : milestone
        )
      );
    } catch (error) {
      console.error("FUND_MILESTONE_ERROR", error);
      alert(error.message);
    }
  }



  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-5">
        <div className="h-56 animate-pulse rounded-[2rem] bg-[#eadfd2]" />
        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-[1.5rem] border border-[#eadfd2] bg-white/60"
            />
          ))}
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="mx-auto max-w-[1480px]">
        <div className="rounded-[2rem] border border-[#fecaca] bg-[#fef2f2] p-6 text-sm font-semibold text-[#b91c1c]">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }


  const formattedDeadline = new Date(
    project.deadline
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedBudget = Number(
    project.budget
  ).toLocaleString("en-IN");

  const formattedStatus =
    project.status.charAt(0) +
    project.status.slice(1).toLowerCase();

  const acceptedProposal = proposals.find(
    (proposal) => proposal.status === "ACCEPTED"
  );

  return (
    <>
      <div className="mx-auto max-w-[1480px]">

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => router.push("/client/projects")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#7c6858] transition hover:text-[#6f2e1c]"
          >
            ← Back to Projects
          </button>

          {/* PROJECT HERO */}


          <section className="rounded-[2rem] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-8 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex items-start justify-between gap-6">

              <div>
                <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#f4b454]">
                  PROJECT DETAILS
                </span>

                <h1 className="mt-5 text-4xl font-black tracking-[-0.04em]">
                  {project.title}
                </h1>

                <p className="mt-4 max-w-3xl leading-7 text-[#f6e3d1]">
                  {project.description}
                </p>
              </div>

              <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white">
                {formattedStatus}
              </span>

            </div>
          </section>

          {/* PROJECT INFORMATION */}

          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Budget */}

            <div className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-semibold text-[#7c6858]">
                Budget
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#24130c]">
                ₹{formattedBudget}
              </h2>
            </div>

            {/* Category */}

            <div className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-semibold text-[#7c6858]">
                Category
              </p>

              <h2 className="mt-2 text-xl font-black text-[#24130c]">
                {project.category}
              </h2>
            </div>

            {/* Deadline */}

            <div className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-semibold text-[#7c6858]">
                Deadline
              </p>

              <h2 className="mt-2 text-xl font-black text-[#24130c]">
                {formattedDeadline}
              </h2>
            </div>

          </section>


          {/* PROJECT MANAGEMENT */}


          <section className="mt-6 rounded-[2rem] border border-[#eadfd2] bg-white/80 p-7 shadow-sm">

            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#24130c]">
              Project Management
            </h2>

            <p className="mt-2 text-[#806049]">
              Manage this project&apos;s lifecycle and upcoming actions.
            </p>

            {/* Cancel error */}

            {cancelError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {cancelError}
              </div>
            )}

            {/* OPEN PROJECT ACTIONS */}

            {project.status === "OPEN" && (
              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/client/projects/${projectId}/edit`
                    )
                  }
                  className="rounded-2xl bg-[#6f2e1c] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
                >
                  Edit Project
                </button>

                <button
                  type="button"
                  onClick={handleCancelProject}
                  disabled={cancelling}
                  className="
                    rounded-xl
                    border
                    border-red-300
                    px-6
                    py-3
                    text-red-500
                    transition-colors
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Project"}
                </button>

              </div>
            )}

            {/* ACTIVE PROJECT MESSAGE */}

            {project.status === "ACTIVE" && (
              <div className="mt-6 rounded-2xl border border-[#f0d7c3] bg-[#fff7ed] px-4 py-3 text-sm font-semibold text-[#7c341d]">
                Freelancer assigned. Manage project work through milestones.
              </div>
            )}

            {/* CANCELLED PROJECT MESSAGE */}

            {project.status === "CANCELLED" && (
              <p className="mt-6 text-sm font-semibold text-[#7c6858]">
                This project has been cancelled and can no longer be edited.
              </p>
            )}

          </section>


          {/* MILESTONES */}


          <section className="mt-6 rounded-[2rem] border border-[#eadfd2] bg-white/80 p-7 shadow-sm">

            {/* Header */}

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em] text-[#24130c]">
                  Milestones
                </h2>

                <p className="mt-2 text-[#806049]">
                  Track project deliverables, deadlines and payments.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="rounded-full bg-[#f7efe4] px-4 py-2 text-sm font-bold text-[#6f2e1c]">
                  {milestones.length}{" "}
                  {milestones.length === 1
                    ? "Milestone"
                    : "Milestones"}
                </span>

                {project.status === "ACTIVE" && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateMilestone(true)
                    }
                    className="rounded-2xl bg-[#6f2e1c] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#5b2416]"
                  >
                    + Create Milestone
                  </button>
                )}

              </div>
            </div>

            {/* Loading */}

            {milestonesLoading && (
              <p className="mt-6 text-sm font-semibold text-[#7c6858]">
                Loading milestones...
              </p>
            )}

            {/* Error */}

            {milestonesError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {milestonesError}
              </div>
            )}

            {/* Empty state */}

            {!milestonesLoading &&
              !milestonesError &&
              milestones.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-[#eadfd2] bg-[#fffaf3] p-8 text-center">

                  <h3 className="font-black text-[#24130c]">
                    No milestones yet
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-[#7c6858]">
                    Create milestones to divide the project into
                    deliverables, deadlines and payments.
                  </p>

                </div>
              )}

            {/* Milestone cards */}

            {!milestonesLoading &&
              !milestonesError &&
              milestones.length > 0 && (
                <div className="mt-6 space-y-4">

                  {milestones.map((milestone) => {
                    const formattedAmount = Number(
                      milestone.amount
                    ).toLocaleString("en-IN");

                    const formattedDueDate = new Date(
                      milestone.dueDate
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    const formattedMilestoneStatus =
                      milestone.status.charAt(0) +
                      milestone.status
                        .slice(1)
                        .toLowerCase();

                    return (
                      <article
                        key={milestone.id}
                        className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-6"
                      >

                        <div className="flex items-start justify-between gap-5">

                          <div>
                            <h3 className="text-lg font-black tracking-[-0.03em] text-[#24130c]">
                              {milestone.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#6f5a4c]">
                              {milestone.description}
                            </p>
                          </div>

                          <span className="rounded-full border border-[#eadfd2] bg-white px-3 py-2 text-sm font-bold text-[#6f2e1c]">
                            {formattedMilestoneStatus}
                          </span>

                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                          <div className="rounded-2xl bg-white p-4">

                            <p className="text-xs font-bold text-[#806049]">
                              Milestone Amount
                            </p>

                            <p className="mt-2 font-black text-[#24130c]">
                              ₹{formattedAmount}
                            </p>

                          </div>

                          <div className="rounded-2xl bg-white p-4">

                            <p className="text-xs font-bold text-[#806049]">
                              Due Date
                            </p>

                            <p className="mt-2 font-black text-[#24130c]">
                              {formattedDueDate}
                            </p>


                          </div>

                        </div>
                        <div className="mt-6 flex justify-end gap-3">

                          {milestone.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handleFundMilestone(milestone.id)}
                              className="rounded-2xl bg-[#6f2e1c] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#5b2416]"
                            >
                              Simulate Funding
                            </button>
                          )}

                          {milestone.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditingMilestone(milestone)}
                                className="rounded-2xl border border-[#eadfd2] bg-white px-5 py-2.5 text-sm font-bold text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteMilestone(milestone.id)}
                                className="rounded-2xl border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </>
                          )}

                        </div>

                      </article>
                    );
                  })}

                </div>
              )}

          </section>


          {/* PROPOSALS */}


          <section className="mt-6 rounded-[2rem] border border-[#eadfd2] bg-white/80 p-7 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em] text-[#24130c]">
                  Proposals
                </h2>

                <p className="mt-2 text-[#806049]">
                  Review proposals submitted by freelancers for this project.
                </p>
              </div>

              <span className="rounded-full bg-[#f7efe4] px-4 py-2 text-sm font-bold text-[#6f2e1c]">
                {proposals.length}{" "}
                {proposals.length === 1
                  ? "Proposal"
                  : "Proposals"}
              </span>

            </div>

            {/* Proposal loading */}

            {proposalsLoading && (
              <p className="mt-6 text-sm font-semibold text-[#7c6858]">
                Loading proposals...
              </p>
            )}

            {/* Proposal fetch error */}

            {proposalsError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {proposalsError}
              </div>
            )}

            {/* Proposal acceptance error */}

            {acceptProposalError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {acceptProposalError}
              </div>
            )}

            {/* No proposals */}

            {!proposalsLoading &&
              !proposalsError &&
              proposals.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-[#eadfd2] bg-[#fffaf3] p-8 text-center">

                  <h3 className="font-black text-[#24130c]">
                    No proposals yet
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-[#7c6858]">
                    Freelancer proposals will appear here when
                    they are submitted.
                  </p>

                </div>
              )}

            {/* Proposal cards */}

            {!proposalsLoading &&
              !proposalsError &&
              proposals.length > 0 && (
                <div className="mt-6 space-y-4">

                  {proposals.map((proposal) => {
                    const formattedBid = Number(
                      proposal.bidAmount
                    ).toLocaleString("en-IN");

                    const formattedProposalStatus =
                      proposal.status.charAt(0) +
                      proposal.status
                        .slice(1)
                        .toLowerCase();

                    return (
                      <article
                        key={proposal.id}
                        className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-6"
                      >

                        <div className="flex items-start justify-between gap-6">

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6f2e1c] font-semibold text-white">
                              {proposal.freelancer.name
                                ?.charAt(0)
                                .toUpperCase() || "F"}
                            </div>

                            <div>

                              <h3 className="text-lg font-black tracking-[-0.03em] text-[#24130c]">
                                {proposal.freelancer.name}
                              </h3>

                              <p className="mt-1 text-sm font-semibold text-[#7c6858]">
                                Submitted a proposal
                              </p>

                            </div>

                          </div>

                          <span className="rounded-full border border-[#eadfd2] bg-white px-3 py-2 text-sm font-bold text-[#6f2e1c]">
                            {formattedProposalStatus}
                          </span>

                        </div>

                        <p className="mt-5 text-sm leading-6 text-[#6f5a4c]">
                          {proposal.coverLetter}
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                          <div className="rounded-2xl bg-white p-4">

                            <p className="text-xs font-bold text-[#806049]">
                              Proposed Budget
                            </p>

                            <p className="mt-2 font-black text-[#24130c]">
                              ₹{formattedBid}
                            </p>

                          </div>

                          <div className="rounded-2xl bg-white p-4">

                            <p className="text-xs font-bold text-[#806049]">
                              Estimated Delivery
                            </p>

                            <p className="mt-2 font-black text-[#24130c]">
                              {proposal.estimatedDays} days
                            </p>

                          </div>

                        </div>

                        {project.status === "OPEN" &&
                          proposal.status === "PENDING" && (
                            <div className="mt-5 flex flex-wrap justify-end gap-3">

                              <button
                                type="button"
                                className="rounded-xl border border-[#eadfd2] px-5 py-2.5 text-sm font-medium text-[#6f2e1c] hover:bg-[#f7efe4]"
                              >
                                View Freelancer
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAcceptProposal(
                                    proposal.id
                                  )
                                }
                                disabled={
                                  acceptingProposalId !== null
                                }
                                className="rounded-2xl bg-[#6f2e1c] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {acceptingProposalId ===
                                  proposal.id
                                  ? "Accepting..."
                                  : "Accept Proposal"}
                              </button>

                            </div>
                          )}

                      </article>
                    );
                  })}

                </div>
              )}

          </section>

      </div>

      {/* CREATE MILESTONE MODAL */}

      {showCreateMilestone && (
        <CreateMilestoneModal
          projectId={projectId}
          projectBudget={project.budget}
          existingMilestones={milestones}
          onClose={() =>
            setShowCreateMilestone(false)
          }
          onMilestoneCreated={(newMilestone) => {
            setMilestones((currentMilestones) => [
              ...currentMilestones,
              newMilestone,
            ]);
          }}
        />
      )}
      {editingMilestone && (
        <EditMilestonesModel
          projectId={projectId}
          projectBudget={project.budget}
          existingMilestones={milestones}
          milestone={editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onMilestoneUpdated={(updatedMilestone) => {

            setMilestones((currentMilestones) =>
              currentMilestones.map((milestone) =>
                milestone.id === updatedMilestone.id
                  ? updatedMilestone
                  : milestone
              )
            );

            setEditingMilestone(null);
          }}
        />
      )}

    </>
  );
}