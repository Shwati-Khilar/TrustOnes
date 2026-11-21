"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectSummaryCard from "./ProjectSummaryCard";

export default function ProjectsForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
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

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: Number(formData.budget),
          deadline: formData.deadline,
        }),
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
            <label className="block mb-2 font-medium text-[#2B1A12]">
              Project Title
            </label>

            <input
              name="title"
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
            <label className="block mb-2 font-medium text-[#2B1A12]">
              Description
            </label>

            <textarea
              rows={7}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your project..."
              className="w-full rounded-xl border border-[#E9D8C8] px-5 py-4 resize-none outline-none focus:border-[#8B5A2B]"
            />
          </div>

          {/* Category / Budget / Deadline */}
          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className="block mb-2 font-medium text-[#2B1A12]">
                Category
              </label>

              <select
                name="category"
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
              <label className="block mb-2 font-medium text-[#2B1A12]">
                Budget (₹)
              </label>

              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="1"
                placeholder="5000"
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4 outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-[#2B1A12]">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4 outline-none focus:border-[#8B5A2B]"
              />
            </div>

          </div>

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