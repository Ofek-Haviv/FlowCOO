import { Calendar, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

export interface Project {
  id: string;
  title: string;
  category: "personal" | "business" | "finance" | "design" | "urgent";
  dueDate?: string;
  description?: string;
  progress: number;
  tasks: {
    total: number;
    completed: number;
  };
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

const ProjectCard = ({ project, onClick, className }: ProjectCardProps) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [dialogNewTaskTitle, setDialogNewTaskTitle] = useState('');
  
  // Fetch project tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id || !project.id) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/tasks?userId=${user.id}&projectId=${project.id}`);
        if (!response.ok) throw new Error('Failed to fetch project tasks');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching project tasks:', err);
      }
    };
    fetchTasks();
  }, [user, project.id]);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    setShowDetails(true);
    if (onClick) onClick();
  };

  // Progress calculation based on tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Add task inline (to backend)
  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '' || !user?.id) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          category: 'project',
          completed: false,
          userId: user.id,
          projectId: project.id
        })
      });
      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Error adding project task:', err);
    }
  };

  // Add task in dialog (to backend)
  const handleDialogAddTask = async () => {
    if (dialogNewTaskTitle.trim() === '' || !user?.id) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dialogNewTaskTitle,
          category: 'project',
          completed: false,
          userId: user.id,
          projectId: project.id
        })
      });
      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setDialogNewTaskTitle('');
    } catch (err) {
      console.error('Error adding project task:', err);
    }
  };

  // Toggle task completion (update backend)
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Error updating project task:', err);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all cursor-pointer",
          className
        )}
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CategoryBadge category={project.category} />
              {project.dueDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(project.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium mt-2">{project.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleExpand}
            className="flex-shrink-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="text-gray-500">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{completedTasks} completed</span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
        </div>
        
        <div className="mt-2 flex gap-2">
          <input
            className="border rounded px-2 py-1 text-sm flex-1"
            placeholder="Add task..."
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddTask}
            className="flex-shrink-0"
          >
            Add
          </Button>
        </div>
        
        {tasks.length > 0 && (
          <div className="mt-3 space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); handleToggleTask(task.id); }}>
                <div className={`${task.completed ? 'text-green-500' : 'text-gray-300'}`}> <CheckCircle className="h-5 w-5" /> </div>
                <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
              </div>
            ))}
          </div>
        )}
        
        {isExpanded && (
          <div className="mt-4 text-sm text-gray-600 animate-fade-in">
            <p>{project.description}</p>
          </div>
        )}
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CategoryBadge category={project.category} />
              {project.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {project.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-sm mt-1">{project.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Progress</h3>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Completion</span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Tasks</h3>
              <div className="mt-2 border rounded-md divide-y">
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <div key={task.id} className="p-3 flex items-center justify-between cursor-pointer" onClick={() => handleToggleTask(task.id)}>
                      <div className="flex items-center gap-2">
                        <div className={`${task.completed ? 'text-green-500' : 'text-gray-300'}`}> <CheckCircle className="h-5 w-5" /> </div>
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                      </div>
                      {task.dueDate && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No tasks added to this project yet</div>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  className="border rounded px-2 py-1 text-sm flex-1"
                  placeholder="Add task..."
                  value={dialogNewTaskTitle}
                  onChange={e => setDialogNewTaskTitle(e.target.value)}
                />
                <Button size="sm" variant="outline" onClick={handleDialogAddTask}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
