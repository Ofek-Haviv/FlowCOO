import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectCard, { Project, ProjectTask } from "../ProjectCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projectTasks as initialProjectTasks } from "@/data/projectsData";

interface ProjectsSectionProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

const ProjectsSection = ({ projects, onProjectClick }: ProjectsSectionProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Your ongoing long-term projects</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => navigate("/projects")}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.slice(0, 2).map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project.id)}
          />
        ))}
        <Button 
          variant="ghost" 
          className="w-full text-sm text-muted-foreground"
          onClick={() => navigate("/projects")}
        >
          View all projects
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;
