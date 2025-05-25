
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Project } from "@/components/ProjectCard";

interface NewProjectDialogProps {
  onAddProject: (project: Project) => void;
}

const NewProjectDialog = ({ onAddProject }: NewProjectDialogProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    category: "business",
    description: "",
    progress: 0,
    tasks: {
      total: 0,
      completed: 0
    }
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleAddProject = () => {
    if (newProject.title?.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        category: newProject.category as "personal" | "business" | "finance" | "design" | "urgent",
        description: newProject.description,
        dueDate: selectedDate ? selectedDate.toISOString() : undefined,
        progress: 0,
        tasks: {
          total: 0,
          completed: 0
        }
      };
      
      onAddProject(project);
      setShowAddDialog(false);
      setNewProject({
        title: "",
        category: "business",
        description: "",
        progress: 0,
        tasks: {
          total: 0,
          completed: 0
        }
      });
      setSelectedDate(undefined);
    }
  };

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new project to organize your work
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Project title" 
              value={newProject.title} 
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={newProject.category} 
              onValueChange={(value: "personal" | "business" | "finance" | "design" | "urgent") => 
                setNewProject({ ...newProject, category: value })
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
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the project" 
              value={newProject.description} 
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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
          <Button onClick={handleAddProject}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
