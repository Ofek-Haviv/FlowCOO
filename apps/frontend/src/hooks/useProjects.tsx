import { useState, useEffect } from "react";
import { Project } from "@/components/ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectTask } from "@/components/ProjectCard";

const API_URL = 'http://localhost:4000';

export const useProjects = (userId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTasks, setProjectTasks] = useState<Record<string, ProjectTask[]>>({});
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
        // Fetch tasks for each project
        await Promise.all(data.map(project => fetchProjectTasks(project.id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  const fetchProjectTasks = async (projectId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks?userId=${userId}&projectId=${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project tasks');
      const data = await response.json();
      setProjectTasks(prev => ({ ...prev, [projectId]: data }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, userId }),
      });
      if (!response.ok) throw new Error('Failed to add project');
      const newProject = await response.json();
      setProjects(prev => [newProject, ...prev]);
      setProjectTasks(prev => ({ ...prev, [newProject.id]: [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update project');
      const updatedProject = await response.json();
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects(prev => prev.filter(project => project.id !== id));
      setProjectTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[id];
        return newTasks;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const filteredProjects = projects
    .filter(project => {
      if (searchTerm) {
        return project.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(project => {
      if (filter) return project.category === filter;
      return true;
    });

  return {
    projects,
    projectTasks,
    isLoading,
    error,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    selectedProject,
    setSelectedProject,
    filteredProjects,
    handleProjectSelect,
    addProject,
    updateProject,
    deleteProject
  };
};
