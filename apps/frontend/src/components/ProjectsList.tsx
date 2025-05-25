
import ProjectCard, { Project, ProjectTask } from "@/components/ProjectCard";

interface ProjectsListProps {
  projects: Project[];
  projectTasks: Record<string, ProjectTask[]>;
  onProjectSelect: (projectId: string) => void;
  isLoading?: boolean;
}

const ProjectsList = ({ projects, projectTasks, onProjectSelect, isLoading = false }: ProjectsListProps) => {
  if (isLoading) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.length > 0 ? (
        projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            projectTasks={projectTasks[project.id] || []}
            onClick={() => onProjectSelect(project.id)}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          No projects found
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
