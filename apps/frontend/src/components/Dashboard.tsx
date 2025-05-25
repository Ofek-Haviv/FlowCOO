
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClickUpDashboard from "./ClickUpDashboard";
import DashboardMetrics from "./dashboard/DashboardMetrics";
import TasksSection from "./dashboard/TasksSection";
import ProjectsSection from "./dashboard/ProjectsSection";
import { initialTasks, projects, businessMetrics } from "./dashboard/data";
import { Task } from "./TaskCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [clickUpConnected, setClickUpConnected] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleConnectClickUp = () => {
    // In a real implementation, this would open OAuth flow or API key input
    console.log("Connecting to ClickUp...");
    // For demo purposes, we'll just set as connected
    setClickUpConnected(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Today</h1>
        <p className="text-muted-foreground text-lg">{new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <DashboardMetrics metrics={businessMetrics} />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Personal & Business</TabsTrigger>
          <TabsTrigger value="tech">Tech Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <TasksSection 
              tasks={tasks} 
              onToggleComplete={handleToggleComplete} 
            />
            <ProjectsSection 
              projects={projects} 
              onProjectClick={handleProjectClick} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="tech">
          <div className="mt-4">
            <ClickUpDashboard 
              isConnected={clickUpConnected}
              onConnect={handleConnectClickUp}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
