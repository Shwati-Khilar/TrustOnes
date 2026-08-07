"use client";

import { useEffect, useState } from "react";

import ProjectsHero from "../../../components/client/project/ProjectsHero";
import ProjectsStats from "../../../components/client/project/ProjectsStats";
import ProjectsFilters from "../../../components/client/project/ProjectsFilters";
import ProjectsGrid from "../../../components/client/project/ProjectsGrid";

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
      <div className="mt-8 rounded-2xl bg-white p-8">
        Loading...
      </div>
    )}

    {!loading && error && (
      <div className="mt-8 rounded-2xl bg-white p-8 text-red-600">
        {error}
      </div>
    )}

    {!loading && !error && (
      <ProjectsGrid projects={filteredProjects} />
    )}
  </>
);
}