
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, CheckCircle } from "lucide-react";

// Placeholder data (would be replaced with actual ClickUp API data)
const techTasks = [
  { 
    id: "1", 
    name: "Frontend refactoring", 
    status: "in_progress", 
    dueDate: "2025-05-20", 
    assignee: "Me",
    priority: "high" 
  },
  { 
    id: "2", 
    name: "API integration", 
    status: "to_do", 
    dueDate: "2025-05-25", 
    assignee: "Sarah",
    priority: "medium" 
  },
  { 
    id: "3", 
    name: "Testing implementation", 
    status: "to_do", 
    dueDate: "2025-05-30", 
    assignee: "David",
    priority: "low" 
  },
  { 
    id: "4", 
    name: "Performance optimization", 
    status: "in_progress", 
    dueDate: "2025-05-22", 
    assignee: "Me",
    priority: "medium" 
  },
  { 
    id: "5", 
    name: "Bug fixes", 
    status: "done", 
    dueDate: "2025-05-10", 
    assignee: "Me",
    priority: "high" 
  }
];

const projects = [
  { id: "1", name: "Website Redesign", completedTasks: 12, totalTasks: 20 },
  { id: "2", name: "Mobile App Development", completedTasks: 8, totalTasks: 30 },
  { id: "3", name: "API Refactoring", completedTasks: 5, totalTasks: 15 }
];

export interface ClickUpDashboardProps {
  isConnected?: boolean;
  onConnect?: () => void;
}

const ClickUpDashboard: React.FC<ClickUpDashboardProps> = ({
  isConnected = false,
  onConnect = () => console.log("Connect to ClickUp clicked"),
}) => {
  const [filter, setFilter] = useState("all");
  
  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            ClickUp Integration
          </CardTitle>
          <CardDescription>Connect your ClickUp workspace to manage tech tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <ClipboardList className="h-16 w-16 mb-4 text-muted-foreground" />
          <p className="text-center text-muted-foreground mb-4">
            Connect your ClickUp workspace to sync tasks, track progress, and manage your tech projects directly from here.
          </p>
          <Button onClick={onConnect}>
            Connect ClickUp
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Filter tasks based on selected filter
  const filteredTasks = techTasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "my_tasks") return task.assignee === "Me";
    if (filter === "to_do") return task.status === "to_do";
    if (filter === "in_progress") return task.status === "in_progress";
    if (filter === "done") return task.status === "done";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "to_do": return "bg-gray-200 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "done": return "bg-green-100 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          ClickUp Tech Tasks
        </CardTitle>
        <CardDescription>Manage your tech team tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-4">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:px-0 sm:mx-0 mb-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="whitespace-nowrap"
                >
                  All
                </Button>
                <Button 
                  variant={filter === "my_tasks" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("my_tasks")}
                  className="whitespace-nowrap"
                >
                  My Tasks
                </Button>
                <Button 
                  variant={filter === "to_do" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("to_do")}
                  className="whitespace-nowrap"
                >
                  To Do
                </Button>
                <Button 
                  variant={filter === "in_progress" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("in_progress")}
                  className="whitespace-nowrap"
                >
                  In Progress
                </Button>
                <Button 
                  variant={filter === "done" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("done")}
                  className="whitespace-nowrap"
                >
                  Done
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div key={task.id} className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{task.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className="text-sm text-gray-500">{task.assignee}</span>
                      <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-4">
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className="text-sm text-gray-500">
                      {project.completedTasks}/{project.totalTasks} tasks
                    </span>
                  </div>
                  <Progress 
                    value={(project.completedTasks / project.totalTasks) * 100} 
                    className="h-2"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {Math.round((project.completedTasks / project.totalTasks) * 100)}% complete
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClickUpDashboard;
