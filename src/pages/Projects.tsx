
import ProjectFilters from "@/components/ProjectFilters";
import NewProjectDialog from "@/components/NewProjectDialog";
import ProjectsList from "@/components/ProjectsList";
import { useProjects } from "@/hooks/useProjects";

const Projects = () => {
  const {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filteredProjects,
    projectTasks,
    isLoading,
    handleAddProject,
    handleProjectSelect
  } = useProjects();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <ProjectFilters 
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        
        <NewProjectDialog onAddProject={handleAddProject} />
      </div>

      <ProjectsList 
        projects={filteredProjects}
        projectTasks={projectTasks}
        onProjectSelect={handleProjectSelect}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Projects;
