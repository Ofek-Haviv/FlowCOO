
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard, { Task } from "../TaskCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TasksSectionProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TasksSection = ({ tasks, onToggleComplete }: TasksSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Priority Tasks</CardTitle>
          <CardDescription>Tasks that need your attention today</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => navigate("/tasks")}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.slice(0, 3).map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
          />
        ))}
        <Button 
          variant="ghost" 
          className="w-full text-sm text-muted-foreground"
          onClick={() => navigate("/tasks")}
        >
          View all tasks
        </Button>
      </CardContent>
    </Card>
  );
};

export default TasksSection;
