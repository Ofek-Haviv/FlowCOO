
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProjectFiltersProps {
  filter: string | null;
  setFilter: (filter: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ProjectFilters = ({ filter, setFilter, searchTerm, setSearchTerm }: ProjectFiltersProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search projects" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
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
        </div>
      </div>
    </>
  );
};

export default ProjectFilters;
