"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Paperclip,
  Plus,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

const submissionTypeOptions = [
  { label: "Development", value: "DEVELOPMENT" },
  { label: "Design", value: "DESIGN" },
  { label: "Video", value: "VIDEO" },
  { label: "Document", value: "DOCUMENT" },
  { label: "Writing", value: "WRITING" },
  { label: "General", value: "GENERAL" },
];

const attachmentTypeOptions = [
  { label: "Link", value: "LINK" },
  { label: "Image", value: "IMAGE" },
  { label: "Video", value: "VIDEO" },
  { label: "Document", value: "DOCUMENT" },
  { label: "Archive", value: "ARCHIVE" },
  { label: "Source Code", value: "SOURCE_CODE" },
  { label: "Design File", value: "DESIGN_FILE" },
  { label: "Other", value: "OTHER" },
];

const initialForm = {
  submissionType: "DEVELOPMENT",
  title: "",
  note: "",
  previewUrl: "",
  proofUrl: "",
  repositoryUrl: "",
  liveUrl: "",
  sourceFileUrl: "",
  finalDeliveryUrl: "",
  finalDeliveryNote: "",
  attachments: [
    {
      label: "Preview proof",
      externalUrl: "",
      attachmentType: "LINK",
      visibility: "PREVIEW",
      description: "",
    },
    {
      label: "Locked final delivery",
      externalUrl: "",
      attachmentType: "SOURCE_CODE",
      visibility: "FINAL_LOCKED",
      description: "",
    },
  ],
};

function fieldHelper(type) {
  const helpers = {
    DEVELOPMENT:
      "Add demo/live URL, repository proof, screenshots or walkthrough. Keep final source locked.",
    DESIGN:
      "Add watermarked preview, low-resolution export, Figma/Canva preview, and locked source file link.",
    VIDEO:
      "Add watermarked/low-res preview video and keep final 4K/source files locked.",
    DOCUMENT:
      "Add preview PDF/read-only link and keep editable/final file locked.",
    WRITING:
      "Add preview draft/read-only document and keep final editable file locked.",
    GENERAL:
      "Add safe preview proof and locked final delivery based on milestone terms.",
  };

  return helpers[type] || helpers.GENERAL;
}

function emptyAttachment() {
  return {
    label: "",
    externalUrl: "",
    attachmentType: "LINK",
    visibility: "PREVIEW",
    description: "",
  };
}

export default function FreelancerSubmitWorkModal({
  open,
  milestone,
  onClose,
  onSubmitted,
}) {
  const [form, setForm] = useState(initialForm);
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!open || !milestone?.id) return;

    let ignore = false;

    async function loadSubmissionInfo() {
      try {
        setLoadingInfo(true);
        setMessage({ type: "", text: "" });
        setForm({
          ...initialForm,
          title: `${milestone.title || "Milestone"} submission`,
        });

        const response = await fetch(
          `/api/freelancer/milestones/${milestone.id}/submissions`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load submission rules.");
        }

        if (!ignore) {
          setSubmissionInfo(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setMessage({
            type: "error",
            text: error.message || "Unable to load submission rules.",
          });
        }
      } finally {
        if (!ignore) {
          setLoadingInfo(false);
        }
      }
    }

    loadSubmissionInfo();

    return () => {
      ignore = true;
    };
  }, [open, milestone]);

  if (!open) return null;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateAttachment(index, field, value) {
    setForm((current) => ({
      ...current,
      attachments: current.attachments.map((attachment, attachmentIndex) =>
        attachmentIndex === index
          ? {
              ...attachment,
              [field]: value,
            }
          : attachment
      ),
    }));
  }

  function addAttachment() {
    setForm((current) => ({
      ...current,
      attachments: [...current.attachments, emptyAttachment()],
    }));
  }

  function removeAttachment(index) {
    setForm((current) => ({
      ...current,
      attachments: current.attachments.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function submitWork() {
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      const cleanAttachments = form.attachments
        .map((attachment) => ({
          ...attachment,
          label: attachment.label.trim(),
          externalUrl: attachment.externalUrl.trim(),
          description: attachment.description.trim(),
        }))
        .filter((attachment) => attachment.externalUrl);

      const response = await fetch(
        `/api/freelancer/milestones/${milestone.id}/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            ...form,
            attachments: cleanAttachments,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit work.");
      }

      setMessage({
        type: "success",
        text: "Work submitted successfully. Client review window has started.",
      });

      await onSubmitted?.(result.data);

      setTimeout(() => {
        onClose?.();
      }, 700);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to submit work.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = submissionInfo?.submissionRules?.canSubmit !== false;
  const blockReason =
    submissionInfo?.submissionRules?.blockReason ||
    "This milestone may need funding or revision status before submission.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24130c]/55 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-[#eadfd2] bg-[#fffaf3]/95 p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
                Secure Submission
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#24130c]">
                Submit preview proof and locked final delivery
              </h2>

              <p className="mt-2 text-sm font-semibold text-[#7c6858]">
                {milestone?.title || "Selected milestone"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white text-[#6f2e1c] transition hover:bg-[#fff7ed]"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {message.text && (
            <div
              className={`rounded-2xl border p-4 text-sm font-bold ${
                message.type === "error"
                  ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
                  : "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]"
              }`}
            >
              {message.text}
            </div>
          )}

          {loadingInfo && (
            <div className="rounded-2xl border border-[#eadfd2] bg-white p-4 text-sm font-bold text-[#7c6858]">
              Loading submission rules...
            </div>
          )}

          {!loadingInfo && !canSubmit && (
            <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-4">
              <div className="flex gap-3">
                <AlertTriangle className="shrink-0 text-[#b91c1c]" size={20} />

                <div>
                  <h3 className="text-sm font-black text-[#24130c]">
                    Submission blocked
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-[#b91c1c]">
                    {blockReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
            <section className="space-y-5 rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5">
              <div>
                <h3 className="text-lg font-black text-[#24130c]">
                  Submission Details
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#7c6858]">
                  Preview data is review-safe. Final delivery stays locked until
                  approval or admin release.
                </p>
              </div>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Submission Type
                </span>

                <select
                  value={form.submissionType}
                  onChange={(event) =>
                    updateField("submissionType", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {submissionTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs font-semibold text-[#9b7a64]">
                  {fieldHelper(form.submissionType)}
                </p>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Submission Title
                </span>

                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Example: Dashboard API integration completed"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Delivery Notes
                </span>

                <textarea
                  value={form.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  rows={5}
                  placeholder="Explain what you completed, what the client should review, and any setup/review instructions."
                  className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-black text-[#24130c]">
                    Preview URL
                  </span>

                  <input
                    value={form.previewUrl}
                    onChange={(event) =>
                      updateField("previewUrl", event.target.value)
                    }
                    placeholder="Watermarked preview / demo video"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-black text-[#24130c]">
                    Proof URL
                  </span>

                  <input
                    value={form.proofUrl}
                    onChange={(event) =>
                      updateField("proofUrl", event.target.value)
                    }
                    placeholder="Screenshots / proof folder"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-black text-[#24130c]">
                    Repository Proof URL
                  </span>

                  <input
                    value={form.repositoryUrl}
                    onChange={(event) =>
                      updateField("repositoryUrl", event.target.value)
                    }
                    placeholder="Private repo proof / commit proof"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-black text-[#24130c]">
                    Live Demo URL
                  </span>

                  <input
                    value={form.liveUrl}
                    onChange={(event) =>
                      updateField("liveUrl", event.target.value)
                    }
                    placeholder="Staging/demo link"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Locked Final Delivery URL
                </span>

                <input
                  value={form.finalDeliveryUrl}
                  onChange={(event) =>
                    updateField("finalDeliveryUrl", event.target.value)
                  }
                  placeholder="Final source/export/package link. Client API must redact before approval."
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Locked Final Delivery Note
                </span>

                <textarea
                  value={form.finalDeliveryNote}
                  onChange={(event) =>
                    updateField("finalDeliveryNote", event.target.value)
                  }
                  rows={3}
                  placeholder="Explain what should unlock after approval."
                  className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                />
              </label>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[1.5rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-5 text-white">
                <ShieldCheck size={24} className="text-[#f4b454]" />

                <h3 className="mt-4 text-xl font-black">Security rule</h3>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Client should see only preview proof before approval. Final
                  delivery remains locked and must be hidden from client APIs
                  until release.
                </p>

                <div className="mt-4 space-y-2 text-sm font-semibold text-white/80">
                  <p>• Preview: safe to review</p>
                  <p>• Final: locked until approval</p>
                  <p>• Old versions stay preserved</p>
                  <p>• Review window starts after submit</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5">
                <h3 className="text-lg font-black text-[#24130c]">
                  Review Window
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#7c6858]">
                  {submissionInfo?.submissionRules?.reviewWindowHours || 72}{" "}
                  hours after submission. If the client does not approve,
                  revise, or dispute, milestone becomes eligible for auto-release
                  later.
                </p>
              </div>
            </aside>
          </div>

          <section className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#24130c]">
                  Attachments
                </h3>

                <p className="mt-1 text-sm text-[#7c6858]">
                  Use PREVIEW for safe review files and FINAL_LOCKED for final
                  source/export files.
                </p>
              </div>

              <button
                type="button"
                onClick={addAttachment}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {form.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Paperclip size={17} className="text-[#6f2e1c]" />

                      <p className="text-sm font-black text-[#24130c]">
                        Attachment {index + 1}
                      </p>
                    </div>

                    {form.attachments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-[#b91c1c]"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={attachment.label}
                      onChange={(event) =>
                        updateAttachment(index, "label", event.target.value)
                      }
                      placeholder="Label"
                      className="h-11 rounded-xl border border-[#eadfd2] bg-white px-3 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                    />

                    <input
                      value={attachment.externalUrl}
                      onChange={(event) =>
                        updateAttachment(index, "externalUrl", event.target.value)
                      }
                      placeholder="https://..."
                      className="h-11 rounded-xl border border-[#eadfd2] bg-white px-3 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                    />

                    <select
                      value={attachment.attachmentType}
                      onChange={(event) =>
                        updateAttachment(
                          index,
                          "attachmentType",
                          event.target.value
                        )
                      }
                      className="h-11 rounded-xl border border-[#eadfd2] bg-white px-3 text-sm font-semibold text-[#24130c] outline-none"
                    >
                      {attachmentTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={attachment.visibility}
                      onChange={(event) =>
                        updateAttachment(index, "visibility", event.target.value)
                      }
                      className="h-11 rounded-xl border border-[#eadfd2] bg-white px-3 text-sm font-semibold text-[#24130c] outline-none"
                    >
                      <option value="PREVIEW">PREVIEW - Client can review</option>
                      <option value="FINAL_LOCKED">
                        FINAL_LOCKED - Hidden until approval
                      </option>
                    </select>

                    <input
                      value={attachment.description}
                      onChange={(event) =>
                        updateAttachment(index, "description", event.target.value)
                      }
                      placeholder="Description"
                      className="h-11 rounded-xl border border-[#eadfd2] bg-white px-3 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] md:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-[#eadfd2] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#7c6858]">
              <FileText size={17} />
              Latest submission versions will stay preserved.
            </div>

            <button
              type="button"
              onClick={submitWork}
              disabled={!canSubmit || submitting || loadingInfo}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-6 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <UploadCloud size={18} />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Submit Secure Work
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}