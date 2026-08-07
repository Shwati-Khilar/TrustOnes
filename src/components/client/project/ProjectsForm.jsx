"use client";

import { useState } from "react";
import ProjectSummaryCard from "./ProjectSummaryCard";

export default function ProjectForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="max-w-full mx-auto">

      {/* Header */}

      <div className="mb-8">
        <p className="uppercase tracking-[0.3em] text-[#A77442] text-sm font-semibold">
          PROJECT CREATION
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-[#2B1A12] mt-2">
          Create a new project
        </h1>

        <p className="text-[#9C6A3D] mt-4 text-lg">
          Describe your project clearly so freelancers can send better proposals.
        </p>
      </div>

      {/* Two Column Layout */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left */}

        <div className="xl:col-span-2 bg-white rounded-3xl border border-[#E9D8C8] p-6">

          <h2 className="text-2xl font-semibold mb-8">
            Project Information
          </h2>

          {/* Title */}

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Project Title
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Build an Ecommerce Website"
              className="w-full rounded-xl border border-[#E9D8C8] px-5 py-4 outline-none focus:border-[#8B5A2B]"
            />
          </div>

          {/* Description */}

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={7}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project..."
              className="w-full rounded-xl border border-[#E9D8C8] px-5 py-4 resize-none outline-none focus:border-[#8B5A2B]"
            />
          </div>

          {/* Bottom Row */}

          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4"
              >
                <option value="">Choose</option>
                <option>Development</option>
                <option>Design</option>
                <option>AI</option>
                <option>Marketing</option>
                <option>Writing</option>
                <option>Mobile</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Budget (₹)
              </label>

              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="5000"
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E9D8C8] px-4 py-4"
              />
            </div>

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4 mt-10">

            <button
              className="px-8 py-4 rounded-xl border border-[#D8C2AF]"
            >
              Cancel
            </button>

            <button
              className="px-8 py-4 rounded-xl bg-[#8B5A2B] text-white hover:bg-[#73471F]"
            >
              Create Project
            </button>

          </div>

        </div>

        {/* Right */}

        <ProjectSummaryCard formData={formData} />

      </div>

    </div>
  );
}