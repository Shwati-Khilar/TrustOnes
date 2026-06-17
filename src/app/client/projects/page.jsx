"use client";

import { useState } from "react";

import ClientSidebar from "../../../components/client/ClientSidebar";
import ClientTopNav from "../../../components/client/ClientTopNav";

import ProjectsHero from "../../../components/client/ProjectContents/ProjectsHero";
import ProjectsStats from "../../../components/client/ProjectContents/ProjectsStats";
import ProjectsFilters from "../../../components/client/ProjectContents/ProjectsFilters";
import ProjectsGrid from "../../../components/client/ProjectContents/ProjectsGrid";

import { projects } from "../../../components/client/ProjectContents/ProjectsData";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeStatus === "All"
        ? true
        : project.status === activeStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <ClientSidebar />
      <ClientTopNav />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
        <div className="p-6">

          <ProjectsHero />

          <ProjectsStats
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

          <ProjectsGrid
            projects={filteredProjects}
          />

        </div>
      </main>
    </>
  );
}