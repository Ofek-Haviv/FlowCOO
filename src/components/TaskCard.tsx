import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: "personal" | "business" | "finance" | "design" | "urgent" | "project";
  dueDate?: string;
  description?: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  className?: string;
}

const TaskCard = ({ task, onToggleComplete, className }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    // Prevent click event bubbling to parent div to avoid expanding when clicking checkbox
    onToggleComplete(task.id, checked);
  };

  return (
    <div 
      className={cn(
        "p-4 border rounded-lg bg-white shadow-sm transition-all cursor-pointer",
        task.completed && "bg-gray-50 opacity-70",
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleCheckboxChange}
            className="h-5 w-5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className={cn(
              "font-medium text-sm truncate",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              {task.dueDate && (
                <span className="text-xs text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              )}
              <CategoryBadge category={task.category} />
            </div>
          </div>
          {isExpanded && task.description && (
            <p className="text-sm text-gray-600 mt-2 animate-fade-in">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
