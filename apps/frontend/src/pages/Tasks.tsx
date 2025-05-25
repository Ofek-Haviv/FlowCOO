import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard, { Task } from "@/components/TaskCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CategoryBadge from "@/components/CategoryBadge";
import { CalendarIcon, Filter, PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { projectTasks } from "@/data/projectsData";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from '@/contexts/NotificationsContext';
import { addDays, isBefore, isAfter, isToday } from 'date-fns';

const getAllProjectTasks = () => {
  // Flatten all project tasks into a single array, mark as category 'project'
  return Object.entries(projectTasks).flatMap(([projectId, tasks]) =>
    tasks.map(task => ({
      ...task,
      category: 'project' as const,
      projectId
    }))
  );
};

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    category: "personal",
    completed: false,
    description: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Fetch tasks from backend
    const fetchTasks = async () => {
      if (!user?.id) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/tasks?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, [user]);

  // Add deadline reminder check
  useEffect(() => {
    const checkDeadlines = () => {
      tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
          const dueDate = new Date(task.dueDate);
          const now = new Date();
          
          // Notify for tasks due today
          if (isToday(dueDate)) {
            addNotification({
              title: 'Task Due Today',
              message: `"${task.title}" is due today`,
              type: 'warning',
              link: `/tasks?task=${task.id}`
            });
          }
          
          // Notify for tasks due tomorrow
          if (isToday(addDays(dueDate, -1))) {
            addNotification({
              title: 'Task Due Tomorrow',
              message: `"${task.title}" is due tomorrow`,
              type: 'info',
              link: `/tasks?task=${task.id}`
            });
          }
          
          // Notify for overdue tasks
          if (isBefore(dueDate, now)) {
            addNotification({
              title: 'Task Overdue',
              message: `"${task.title}" is overdue`,
              type: 'error',
              link: `/tasks?task=${task.id}`
            });
          }
        }
      });
    };

    // Check deadlines every hour
    checkDeadlines();
    const interval = setInterval(checkDeadlines, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, addNotification]);

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  const handleAddTask = () => {
    if (newTask.title?.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        category: newTask.category as "personal" | "business" | "finance" | "design" | "urgent" | "project",
        completed: false,
        description: newTask.description,
        dueDate: selectedDate ? selectedDate.toISOString() : undefined
      };
      
      setTasks([task, ...tasks]);
      setShowAddDialog(false);
      setNewTask({ title: "", category: "personal", completed: false, description: "" });
      setSelectedDate(undefined);
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (searchTerm) {
        return task.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(task => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      if (filter) return task.category === filter;
      return true;
    });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tasks</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search tasks" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task to track your work
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Task title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(value: "personal" | "business" | "finance" | "design" | "urgent" | "project") => 
                    setNewTask({ ...newTask, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Add details" 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:px-0 sm:mx-0">
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button 
            variant={filter === "personal" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("personal")}
            className="whitespace-nowrap"
          >
            Personal
          </Button>
          <Button 
            variant={filter === "business" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("business")}
            className="whitespace-nowrap"
          >
            Business
          </Button>
          <Button 
            variant={filter === "finance" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("finance")}
            className="whitespace-nowrap"
          >
            Finance
          </Button>
          <Button 
            variant={filter === "design" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("design")}
            className="whitespace-nowrap"
          >
            Design
          </Button>
          <Button 
            variant={filter === "urgent" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("urgent")}
            className="whitespace-nowrap"
          >
            Urgent
          </Button>
          <Button 
            variant={filter === "project" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("project")}
            className="whitespace-nowrap"
          >
            Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleComplete={handleToggleComplete} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tasks found
            </div>
          )}
        </TabsContent>
        <TabsContent value="pending" className="mt-4 space-y-3">
          {filteredTasks.filter(t => !t.completed).length > 0 ? (
            filteredTasks
              .filter(task => !task.completed)
              .map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleComplete={handleToggleComplete} 
                />
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No pending tasks
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-3">
          {filteredTasks.filter(t => t.completed).length > 0 ? (
            filteredTasks
              .filter(task => task.completed)
              .map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleComplete={handleToggleComplete} 
                />
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No completed tasks
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
