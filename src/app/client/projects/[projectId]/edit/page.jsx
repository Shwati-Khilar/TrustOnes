"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  Loader2,
} from "lucide-react";

import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";

const categories = [
  "Development",
  "Design",
  "Marketing",
  "Writing",
  "Data & AI",
  "Other",
];

export default function EditProjectPage({ params }) {
  const { projectId } = use(params);

  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

        const project = data.project;

        setFormData({
          title: project.title,
          description: project.description,
          category: project.category,
          budget: project.budget,

          // Converts ISO timestamp into YYYY-MM-DD
          // required by <input type="date">
          deadline: new Date(project.deadline)
            .toISOString()
            .split("T")[0],
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
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

      const response = await fetch(
        `/api/projects/${projectId}`,
        {
          method: "PATCH",

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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update project."
        );
      }

      router.push(`/client/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <>
        <ClientSidebar />
        <ClientTopNav />

        <main className="ml-64 min-h-screen bg-[#F8F4EF] pt-20">
          <div className="p-6 text-[#8B5A2B]">
            Loading project...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <ClientSidebar />
      <ClientTopNav />

      <main className="ml-64 min-h-screen bg-[#F8F4EF] pt-20">
        <div className="mx-auto max-w-5xl p-6">
          <button
            type="button"
            onClick={() =>
              router.push(`/client/projects/${projectId}`)
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[#8B5A2B] hover:text-[#3D2414]"
          >
            <ArrowLeft size={18} />

            Back to Project
          </button>

          <section className="rounded-[32px] bg-gradient-to-r from-[#8B5A2B] to-[#5E381C] p-8 text-white">
            <span className="inline-flex rounded-full bg-[#A06B36] px-4 py-2 text-sm font-medium text-[#FFD35A]">
              PROJECT MANAGEMENT
            </span>

            <h1 className="mt-5 text-3xl font-bold">
              Edit Project
            </h1>

            <p className="mt-3 max-w-2xl text-[#EED8C7]">
              Update the project's basic information, budget,
              category and deadline.
            </p>
          </section>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl border border-[#E7DDD2] bg-white p-8"
          >
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-7">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block font-medium text-[#3D2414]"
                >
                  Project Title
                </label>

                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block font-medium text-[#3D2414]"
                >
                  Project Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows={7}
                  className="w-full resize-none rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
                />

                <p className="mt-2 text-right text-xs text-[#B88746]">
                  {formData.description.length}/2000
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block font-medium text-[#3D2414]"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#E7DDD2] bg-white px-4 py-3 outline-none focus:border-[#8B5A2B]"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="mb-2 block font-medium text-[#3D2414]"
                  >
                    Budget
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B88746]"
                    />

                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      min="1"
                      step="1"
                      className="w-full rounded-2xl border border-[#E7DDD2] py-3 pl-11 pr-4 outline-none focus:border-[#8B5A2B]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="mb-2 block font-medium text-[#3D2414]"
                  >
                    Deadline
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B88746]"
                    />

                    <input
                      id="deadline"
                      name="deadline"
                      type="date"
                      min={today}
                      value={formData.deadline}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#E7DDD2] py-3 pl-11 pr-4 outline-none focus:border-[#8B5A2B]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3 border-t border-[#E7DDD2] pt-6">
              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  router.push(`/client/projects/${projectId}`)
                }
                className="rounded-2xl border border-[#E7DDD2] px-6 py-3 font-medium text-[#8B5A2B] hover:bg-[#F8F4EF]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex min-w-40 items-center justify-center gap-2 rounded-2xl bg-[#8B5A2B] px-6 py-3 font-medium text-white hover:bg-[#6D4120] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}