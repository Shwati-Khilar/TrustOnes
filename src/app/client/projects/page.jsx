"use client";

import { useEffect, useState } from "react";

import ClientSidebar from "../../../components/client/ClientSidebar";
import ClientTopNav from "../../../components/client/ClientTopNav";

import ProjectsHero from "../../../components/client/ProjectContents/ProjectsHero";
import ProjectsStats from "../../../components/client/ProjectContents/ProjectsStats";
import ProjectsFilters from "../../../components/client/ProjectContents/ProjectsFilters";
import ProjectsGrid from "../../../components/client/ProjectContents/ProjectsGrid";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/projects");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch projects.");
        }

        setProjects(data.projects);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeStatus === "All"
        ? true
        : project.status === activeStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <ClientSidebar />
      <ClientTopNav />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
        <div className="p-6">
          <ProjectsHero projects={projects} />

          <ProjectsStats
            projects={projects}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
          />

          <ProjectsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            totalProjects={filteredProjects.length}
          />

          {loading && (
            <div className="mt-8 rounded-2xl border border-[#E7DDD2] bg-white p-8 text-center text-[#8B5A2B]">
              Loading projects...
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && (
            <div className="mt-8 rounded-2xl border border-[#E7DDD2] bg-white p-8 text-center">
              <h3 className="text-lg font-semibold text-[#3D2414]">
                No projects found
              </h3>

              <p className="mt-2 text-sm text-[#B88746]">
                Create your first project to get started.
              </p>
            </div>
          )}

          {!loading && !error && filteredProjects.length > 0 && (
            <ProjectsGrid projects={filteredProjects} />
          )}
        </div>
      </main>
    </>
  );
}