"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";
import CreateMilestoneModal from "@/components/client/ProjectContents/CreateMilestoneModal";

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

 

  if (loading) {
    return (
      <>
        <ClientSidebar />
        <ClientTopNav />

        <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
          <div className="p-6">
            <p>Loading project...</p>
          </div>
        </main>
      </>
    );
  }

 
  if (error) {
    return (
      <>
        <ClientSidebar />
        <ClientTopNav />

        <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
          <div className="p-6">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </>
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

  return (
    <>
      <ClientSidebar />

      <ClientTopNav />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
        <div className="p-6 max-w-7xl mx-auto">

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => router.push("/client/projects")}
            className="mb-5 text-[#8B5A2B] font-medium hover:underline"
          >
            ← Back to Projects
          </button>

          {/* PROJECT HERO */}


          <section className="rounded-[32px] bg-gradient-to-r from-[#8B5A2B] to-[#5E381C] p-8 text-white">
            <div className="flex items-start justify-between gap-6">

              <div>
                <span className="inline-flex rounded-full bg-[#A06B36] px-4 py-2 text-sm text-[#FFD35A]">
                  PROJECT DETAILS
                </span>

                <h1 className="mt-5 text-4xl font-bold">
                  {project.title}
                </h1>

                <p className="mt-4 max-w-3xl text-[#EED8C7]">
                  {project.description}
                </p>
              </div>

              <span className="rounded-full bg-white/10 px-5 py-2">
                {formattedStatus}
              </span>

            </div>
          </section>

          {/* PROJECT INFORMATION */}

          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Budget */}

            <div className="rounded-2xl border border-[#E7DDD2] bg-white p-6">
              <p className="text-sm text-[#B88746]">
                Budget
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#3D2414]">
                ₹{formattedBudget}
              </h2>
            </div>

            {/* Category */}

            <div className="rounded-2xl border border-[#E7DDD2] bg-white p-6">
              <p className="text-sm text-[#B88746]">
                Category
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#3D2414]">
                {project.category}
              </h2>
            </div>

            {/* Deadline */}

            <div className="rounded-2xl border border-[#E7DDD2] bg-white p-6">
              <p className="text-sm text-[#B88746]">
                Deadline
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#3D2414]">
                {formattedDeadline}
              </h2>
            </div>

          </section>


          {/* PROJECT MANAGEMENT */}


          <section className="mt-6 rounded-2xl border border-[#E7DDD2] bg-white p-7">

            <h2 className="text-2xl font-semibold text-[#3D2414]">
              Project Management
            </h2>

            <p className="mt-2 text-[#B88746]">
              Manage this project's lifecycle and upcoming actions.
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
                  className="rounded-xl bg-[#8B5A2B] px-6 py-3 text-white hover:bg-[#6D4120] transition-colors"
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
              <div className="mt-6 rounded-xl border border-[#E7DDD2] bg-[#FFFDF9] px-4 py-3 text-sm text-[#8B5A2B]">
                Freelancer assigned. Manage project work through milestones.
              </div>
            )}

            {/* CANCELLED PROJECT MESSAGE */}

            {project.status === "CANCELLED" && (
              <p className="mt-6 text-sm text-[#B88746]">
                This project has been cancelled and can no longer be edited.
              </p>
            )}

          </section>


          {/* MILESTONES */}


          <section className="mt-6 rounded-2xl border border-[#E7DDD2] bg-white p-7">

            {/* Header */}

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h2 className="text-2xl font-semibold text-[#3D2414]">
                  Milestones
                </h2>

                <p className="mt-2 text-[#B88746]">
                  Track project deliverables, deadlines and payments.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="rounded-full bg-[#F7F3EE] px-4 py-2 text-sm font-medium text-[#8B5A2B]">
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
                    className="rounded-xl bg-[#8B5A2B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#6D4120]"
                  >
                    + Create Milestone
                  </button>
                )}

              </div>
            </div>

            {/* Loading */}

            {milestonesLoading && (
              <p className="mt-6 text-sm text-[#B88746]">
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
                <div className="mt-6 rounded-2xl border border-dashed border-[#E7DDD2] bg-[#FFFDF9] p-8 text-center">

                  <h3 className="font-semibold text-[#3D2414]">
                    No milestones yet
                  </h3>

                  <p className="mt-2 text-sm text-[#B88746]">
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
                        className="rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] p-6"
                      >

                        <div className="flex items-start justify-between gap-5">

                          <div>
                            <h3 className="text-lg font-semibold text-[#3D2414]">
                              {milestone.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#6F5544]">
                              {milestone.description}
                            </p>
                          </div>

                          <span className="rounded-full border border-[#E7DDD2] bg-white px-3 py-2 text-sm text-[#8B5A2B]">
                            {formattedMilestoneStatus}
                          </span>

                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                          <div className="rounded-xl border border-[#E7DDD2] bg-white p-4">

                            <p className="text-xs text-[#B88746]">
                              Milestone Amount
                            </p>

                            <p className="mt-2 font-semibold text-[#3D2414]">
                              ₹{formattedAmount}
                            </p>

                          </div>

                          <div className="rounded-xl border border-[#E7DDD2] bg-white p-4">

                            <p className="text-xs text-[#B88746]">
                              Due Date
                            </p>

                            <p className="mt-2 font-semibold text-[#3D2414]">
                              {formattedDueDate}
                            </p>

                          </div>

                        </div>

                      </article>
                    );
                  })}

                </div>
              )}

          </section>


          {/* PROPOSALS */}


          <section className="mt-6 rounded-2xl border border-[#E7DDD2] bg-white p-7">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h2 className="text-2xl font-semibold text-[#3D2414]">
                  Proposals
                </h2>

                <p className="mt-2 text-[#B88746]">
                  Review proposals submitted by freelancers for this project.
                </p>
              </div>

              <span className="rounded-full bg-[#F7F3EE] px-4 py-2 text-sm font-medium text-[#8B5A2B]">
                {proposals.length}{" "}
                {proposals.length === 1
                  ? "Proposal"
                  : "Proposals"}
              </span>

            </div>

            {/* Proposal loading */}

            {proposalsLoading && (
              <p className="mt-6 text-sm text-[#B88746]">
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
                <div className="mt-6 rounded-2xl border border-dashed border-[#E7DDD2] bg-[#FFFDF9] p-8 text-center">

                  <h3 className="font-semibold text-[#3D2414]">
                    No proposals yet
                  </h3>

                  <p className="mt-2 text-sm text-[#B88746]">
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
                        className="rounded-2xl border border-[#E7DDD2] bg-[#FFFDF9] p-6"
                      >

                        <div className="flex items-start justify-between gap-6">

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5A2B] font-semibold text-white">
                              {proposal.freelancer.name
                                ?.charAt(0)
                                .toUpperCase() || "F"}
                            </div>

                            <div>

                              <h3 className="text-lg font-semibold text-[#3D2414]">
                                {proposal.freelancer.name}
                              </h3>

                              <p className="mt-1 text-sm text-[#B88746]">
                                Submitted a proposal
                              </p>

                            </div>

                          </div>

                          <span className="rounded-full border border-[#E7DDD2] bg-white px-3 py-2 text-sm text-[#8B5A2B]">
                            {formattedProposalStatus}
                          </span>

                        </div>

                        <p className="mt-5 text-sm leading-6 text-[#6F5544]">
                          {proposal.coverLetter}
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                          <div className="rounded-xl border border-[#E7DDD2] bg-white p-4">

                            <p className="text-xs text-[#B88746]">
                              Proposed Budget
                            </p>

                            <p className="mt-2 font-semibold text-[#3D2414]">
                              ₹{formattedBid}
                            </p>

                          </div>

                          <div className="rounded-xl border border-[#E7DDD2] bg-white p-4">

                            <p className="text-xs text-[#B88746]">
                              Estimated Delivery
                            </p>

                            <p className="mt-2 font-semibold text-[#3D2414]">
                              {proposal.estimatedDays} days
                            </p>

                          </div>

                        </div>

                        {project.status === "OPEN" &&
                          proposal.status === "PENDING" && (
                            <div className="mt-5 flex flex-wrap justify-end gap-3">

                              <button
                                type="button"
                                className="rounded-xl border border-[#8B5A2B] px-5 py-2.5 text-sm font-medium text-[#8B5A2B] hover:bg-[#F7F3EE]"
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
                                className="
                                  rounded-xl
                                  bg-[#8B5A2B]
                                  px-5
                                  py-2.5
                                  text-sm
                                  font-medium
                                  text-white
                                  transition-colors
                                  hover:bg-[#6D4120]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-60
                                "
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
      </main>

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

    </>
  );
}