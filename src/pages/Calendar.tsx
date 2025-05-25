
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Task } from "@/components/TaskCard";
import { Project } from "@/components/ProjectCard";
import CategoryBadge from "@/components/CategoryBadge";

// Sample data
const tasks: Task[] = [
  {
    id: "1",
    title: "Reply to fabric supplier",
    completed: false,
    category: "business",
    dueDate: new Date().toISOString(),
    description: "Check pricing for the new collection fabrics"
  },
  {
    id: "2",
    title: "Schedule photoshoot",
    completed: false,
    category: "design",
    dueDate: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: "3",
    title: "Walk the dog",
    completed: true,
    category: "personal",
    dueDate: new Date().toISOString()
  },
  {
    id: "4",
    title: "Prepare tax documents",
    completed: false,
    category: "finance",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    description: "Gather receipts for Q1 expenses"
  }
];

const projects: Project[] = [
  {
    id: "1",
    title: "Summer Collection Launch",
    category: "business",
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    description: "Plan and execute the summer collection launch",
    progress: 45,
    tasks: {
      total: 12,
      completed: 5
    }
  },
  {
    id: "2",
    title: "Store Renovation",
    category: "design",
    dueDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    description: "Redesign store layout",
    progress: 20,
    tasks: {
      total: 8,
      completed: 2
    }
  }
];

type Event = {
  date: Date;
  type: "task" | "project";
  id: string;
  title: string;
  category: "personal" | "business" | "finance" | "design" | "urgent";
  completed?: boolean;
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Create event data from tasks and projects
  const events: Event[] = [
    ...tasks.map(task => ({
      date: new Date(task.dueDate || ""),
      type: "task" as const,
      id: task.id,
      title: task.title,
      category: task.category,
      completed: task.completed
    })),
    ...projects.map(project => ({
      date: new Date(project.dueDate || ""),
      type: "project" as const,
      id: project.id,
      title: project.title,
      category: project.category
    }))
  ].filter(event => !isNaN(event.date.getTime()));

  // Get events for selected date
  const selectedDateEvents = events.filter(event => {
    if (!selectedDate) return false;
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Function to check if date has events
  const hasEvents = (date: Date): boolean => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Function to render event indicators in calendar
  const renderEventIndicators = (day: Date) => {
    const dateEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });

    const categories = [...new Set(dateEvents.map(event => event.category))];

    return (
      <div className="flex justify-center gap-1 mt-1">
        {categories.slice(0, 3).map((category, i) => (
          <div
            key={i}
            className={`h-1 w-1 rounded-full ${
              category === "personal"
                ? "bg-green-500"
                : category === "business"
                ? "bg-blue-500"
                : category === "finance"
                ? "bg-yellow-500"
                : category === "design"
                ? "bg-purple-500"
                : "bg-red-500"
            }`}
          />
        ))}
        {categories.length > 3 && <div className="h-1 w-1 rounded-full bg-gray-400" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              components={{
                DayContent: (props: { date: Date }) => (
                  <div className="flex flex-col items-center">
                    <div>{props.date.getDate()}</div>
                    {hasEvents(props.date) && renderEventIndicators(props.date)}
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event, index) => (
                  <div
                    key={`${event.type}-${event.id}`}
                    className={cn(
                      "p-3 border rounded-md",
                      event.type === "task" && event.completed && "bg-gray-50 opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase text-gray-500">
                        {event.type}
                      </span>
                      <CategoryBadge category={event.category} />
                    </div>
                    <h3 className={cn(
                      "text-sm font-medium mt-1",
                      event.type === "task" && event.completed && "line-through"
                    )}>
                      {event.title}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No events scheduled for this day
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
