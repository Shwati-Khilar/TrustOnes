"use client";
import { EvidencePicker,useEvidenceSelection } from "@/components/marketplace/EvidenceFiles";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectSummaryCard from "./ProjectSummaryCard";

export default function ProjectsForm() {
  const selection=useEvidenceSelection();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: "",
    visibility: "PRIVATE",
    budget: "",
    deadline: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await selection.submit("/api/projects","POST",{
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        visibility: formData.visibility,
        budget: formData.budget,
        deadline: formData.deadline,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create project."
        );
      }

      // Project created successfully
      router.push(`/client/projects/${data.project.id}`);
    } catch (error) {
      console.error("CREATE_PROJECT_ERROR", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/client/projects");
  }

  return (
    <div className="max-w-full mx-auto">

      <div className="mb-8">
        <p className="uppercase tracking-[0.3em] text-[#A77442] text-sm font-semibold">
          PROJECT CREATION
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-[#2B1A12] mt-2">
          Create a new project
        </h1>

        <p className="text-[#9C6A3D] mt-4 text-lg">
          Describe your project clearly so freelancers can send better
          proposals.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <form
          onSubmit={handleSubmit}
          className="xl:col-span-2 bg-white rounded-3xl border border-[#E9D8C8] p-6"
        >

          <h2 className="text-2xl font-semibold mb-8 text-[#2B1A12]">
            Project Information
          </h2>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="project-title" className="block mb-2 font-medium text-[#2B1A12]">
              Project Title
            </label>

            <input
              id="project-title" name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={120}
              placeholder="Example: Build an Ecommerce Website"
              className="w-full rounded-xl border border-[#E9D8C8] px-5 py-4 outline-none focus:border-[#8B5A2B]"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="project-description" className="block mb-2 font-medium text-[#2B1A12]">
              Description
            </label>

            <textarea
              rows={7} maxLength={8000} aria-describedby="description-help"
              id="project-description" name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the work, requirements and deliverables…"
              className="w-full rounded-xl border border-[#E9D8C8] px-5 py-4 resize-y outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <p id="description-help" className="-mt-4 mb-5 text-xs text-[#715c4d]">Use headings, lists or emphasis to structure your brief. Set the project deadline in the date field.</p>
          {/* Category / Budget / Deadline */}
          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label htmlFor="project-category" className="block mb-2 font-medium text-[#2B1A12]">
                Category
              </label>

              <select
                id="project-category" name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4 outline-none focus:border-[#8B5A2B]"
              >
                <option value="">Choose</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="AI">AI</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div>
              <label htmlFor="project-budget" className="block mb-2 font-medium text-[#2B1A12]">
                Budget (₹)
              </label>

              <input
                type="number"
                id="project-budget" name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="0.01" step="0.01"
                placeholder="5000"
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4 outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label htmlFor="project-deadline" className="block mb-2 font-medium text-[#2B1A12]">
                Deadline
              </label>

              <input
                type="date"
                id="project-deadline" name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4 outline-none focus:border-[#8B5A2B]"
              />
            </div>

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label>Project visibility<select name="visibility" className="mt-2 w-full rounded-xl border p-3" value={formData.visibility} onChange={handleChange}>
              <option value="PRIVATE">Private invitations</option><option value="PUBLIC">Public discovery</option>
            </select></label>
            <label>Required skills<input name="skills" placeholder="Design, React" value={formData.skills} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3" /></label>
          </div>
          <EvidencePicker selection={selection} brief disabled={submitting}/>
            <p className="mt-3 text-sm">New projects are drafts until you publish them.</p>
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-10">

            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-8 py-4 rounded-xl border border-[#D8C2AF] text-[#24130c] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-xl bg-[#6f2e1c] text-white hover:bg-[#73471F] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Project"}
            </button>

          </div>

        </form>

        <ProjectSummaryCard formData={formData} />

      </div>
    </div>
  );
}