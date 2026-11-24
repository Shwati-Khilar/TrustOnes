"use client";
import { EvidenceList,EvidencePicker,useEvidenceSelection } from "@/components/marketplace/EvidenceFiles";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  Loader2,
} from "lucide-react";


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
  const selection=useEvidenceSelection();
  const [references,setReferences]=useState([]);

  const [originalDeadline, setOriginalDeadline] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
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
        setOriginalDeadline(project.deadline);
        setReferences(project.evidence || []);

        setFormData({
          title: project.title,
          description: project.description,
          skills: project.skills.join(", "),
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

      const response = await selection.submit(`/api/projects/${projectId}`,"PATCH",{
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills.split(",").map(s=>s.trim()).filter(Boolean),
        budget: formData.budget,
        deadline: originalDeadline.slice(0,10) === formData.deadline ? originalDeadline : formData.deadline,
      });

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
        <section>
          <div className="p-6 text-[#6f2e1c]">
            Loading project...
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section>
        <div className="mx-auto max-w-5xl p-6">
          <button
            type="button"
            onClick={() =>
              router.push(`/client/projects/${projectId}`)
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[#6f2e1c] hover:text-[#24130c]"
          >
            <ArrowLeft size={18} />

            Back to Project
          </button>

          <section className="rounded-[2rem] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-8 text-white shadow-xl shadow-[#7c341d]/20">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#f4b454]">
              PROJECT MANAGEMENT
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em]">
              Edit Project
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-[#f6e3d1]">
              Update the project&apos;s basic information, budget,
              category and deadline.
            </p>
          </section>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl border border-[#eadfd2] bg-white p-8"
          >
          <EvidenceList files={references} title="Saved reference files"/>
          <EvidencePicker selection={selection} brief disabled={submitting} existing={references.length}/>
          <label className="block">Required skills<input name="skills" value={formData.skills} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3"/></label>
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-7">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block font-medium text-[#24130c]"
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
                  className="w-full rounded-2xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block font-medium text-[#24130c]"
                >
                  Project Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={8000}
                  rows={7}
                  className="w-full resize-none rounded-2xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#8B5A2B]"
                />

                <p className="mt-2 text-right text-xs text-[#806049]">
                  {formData.description.length}/8000
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block font-medium text-[#24130c]"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 outline-none focus:border-[#8B5A2B]"
                  >
                    {Array.from(new Set([...categories, formData.category].filter(Boolean))).map((category) => (
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
                    className="mb-2 block font-medium text-[#24130c]"
                  >
                    Budget
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#806049]"
                    />

                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      min="0.01"
                      step="0.01"
                      className="w-full rounded-2xl border border-[#eadfd2] py-3 pl-11 pr-4 outline-none focus:border-[#8B5A2B]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="mb-2 block font-medium text-[#24130c]"
                  >
                    Deadline
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#806049]"
                    />

                    <input
                      id="deadline"
                      name="deadline"
                      type="date"
                      min={today}
                      value={formData.deadline}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#eadfd2] py-3 pl-11 pr-4 outline-none focus:border-[#8B5A2B]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3 border-t border-[#eadfd2] pt-6">
              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  router.push(`/client/projects/${projectId}`)
                }
                className="rounded-2xl border border-[#eadfd2] px-6 py-3 font-medium text-[#6f2e1c] hover:bg-[#F8F4EF]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex min-w-40 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-6 py-3 font-medium text-white hover:bg-[#6D4120] disabled:cursor-not-allowed disabled:opacity-60"
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
      </section>
    </>
  );
}