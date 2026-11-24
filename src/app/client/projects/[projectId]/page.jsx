"use client";

import { use, useEffect, useState } from "react";
import ProjectOverview from "@/components/client/project/ProjectOverview";
import { projectDate } from "@/lib/project-presentation";

import CreateMilestoneModal from "@/components/client/project/CreateMilestoneModel";
import EditMilestonesModel from "@/components/client/project/EditMilestonesModel";


export default function ProjectDetailsPage({ params }) {
  const { projectId } = use(params);


  // Project state
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancel project state
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

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

      setProject(current => ({...current, ...data.project, offerActivity: {...current.offerActivity, pending: 0}}));
    } catch (error) {
      console.error("CANCEL_PROJECT_ERROR", error);
      setCancelError(error.message);
    } finally {
      setCancelling(false);
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


  return (
    <>
      <div className="mx-auto max-w-[1480px]">
        <ProjectOverview project={project} milestones={milestonesLoading ? project.milestones || [] : milestones} onPublish={setProject} cancelling={cancelling} cancelError={cancelError} onCancel={handleCancelProject}/>
          {/* MILESTONES */}


          {(project.status === "ACTIVE" || milestones.length > 0 || milestonesError) && <section id="milestones" className="mt-5 scroll-mt-24 rounded-3xl border border-[#e4d7c9] bg-[#fffdf9] p-5 shadow-sm sm:p-7">

            {/* Header */}

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em] text-[#24130c]">
                  Milestones
                </h2>

                <p className="mt-2 text-[#806049]">
                  Plan deliverables against the project budget and track their status.
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

                    const formattedDueDate = projectDate(milestone.dueDate);

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
                        <div className="mt-6 flex flex-wrap justify-end gap-3">

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

          </section>}
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
