"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function EditMilestonesModel({
  projectId,
  projectBudget,
  existingMilestones,
  milestone,
  onClose,
  onMilestoneUpdated,
}) {
  const [formData, setFormData] = useState({
  title: milestone.title,
  description: milestone.description || "",
  amount: milestone.amount,
  dueDate: milestone.dueDate.split("T")[0],
});

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const allocatedAmount = existingMilestones
  .filter((m) => m.id !== milestone.id)
  .reduce(
    (sum, m) => sum + Number(m.amount),
    0
  );

  const remainingAmount =
    Number(projectBudget) - allocatedAmount;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
  `/api/projects/${projectId}/milestones/${milestone.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            amount: Number(formData.amount),
            dueDate: formData.dueDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update milestone."
        );
      }

      onMilestoneUpdated(data.milestone);
      onClose();
    } catch (error) {
      console.error("UPDATE_MILESTONE_ERROR", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-[#eadfd2] bg-white p-7 shadow-xl">

        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="text-2xl font-semibold text-[#24130c]">
              
              Edit Milestone
            </h2>

            <p className="mt-2 text-sm text-[#806049]">
              Update the milestone details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl p-2 text-[#6f2e1c] hover:bg-[#f7efe4]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-[#f7efe4] p-4">
            <p className="text-xs text-[#806049]">
              Project Budget
            </p>

            <p className="mt-2 font-semibold text-[#24130c]">
              ₹{Number(projectBudget).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl bg-[#f7efe4] p-4">
            <p className="text-xs text-[#806049]">
              Allocated
            </p>

            <p className="mt-2 font-semibold text-[#24130c]">
              ₹{allocatedAmount.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl bg-[#f7efe4] p-4">
            <p className="text-xs text-[#806049]">
              Remaining
            </p>

            <p className="mt-2 font-semibold text-green-600">
              ₹{remainingAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="text-sm font-medium text-[#24130c]">
              Milestone Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Example: Complete frontend development"
              className="mt-2 w-full rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#24130c]">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the expected deliverable."
              className="mt-2 w-full resize-none rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#24130c]">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
                max={remainingAmount + Number(milestone.amount)}
                placeholder="2000"
                className="mt-2 w-full rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#24130c]">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#eadfd2] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-[#eadfd2] px-5 py-3 text-[#6f2e1c]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                remainingAmount <= 0
              }
              className="rounded-xl bg-[#6f2e1c] px-6 py-3 text-white hover:bg-[#6D4120] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Updating..."
                : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}