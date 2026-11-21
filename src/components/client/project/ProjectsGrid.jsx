import ProjectCard from "./ProjectsCard";

export default function ProjectsGrid({
  projects,
}) {
  return (
    <div className="mt-8 grid grid-cols-3 gap-5">

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}

    </div>
  );
}