
import { Project, ProjectTask } from "@/components/ProjectCard";

// Sample project tasks data
export const projectTasks: Record<string, ProjectTask[]> = {
  "1": [
    { id: "1-1", title: "Plan photoshoot locations", completed: true },
    { id: "1-2", title: "Design promotional materials", completed: true },
    { id: "1-3", title: "Contact influencers for promotion", completed: true },
    { id: "1-4", title: "Create social media campaign", completed: true },
    { id: "1-5", title: "Finalize store displays", completed: true },
    { id: "1-6", title: "Prepare press release", completed: false },
    { id: "1-7", title: "Organize launch event", completed: false },
    { id: "1-8", title: "Film video content", completed: false },
    { id: "1-9", title: "Update online store", completed: false },
    { id: "1-10", title: "Brief sales team", completed: false },
    { id: "1-11", title: "Prepare email newsletter", completed: false },
    { id: "1-12", title: "Final review of collection", completed: false },
  ],
  "2": [
    { id: "2-1", title: "Create mood board", completed: true },
    { id: "2-2", title: "Draft initial layout", completed: true },
    { id: "2-3", title: "Source new display fixtures", completed: false },
    { id: "2-4", title: "Schedule contractor meetings", completed: false },
    { id: "2-5", title: "Finalize budget", completed: false },
    { id: "2-6", title: "Select color scheme", completed: false },
    { id: "2-7", title: "Order custom fixtures", completed: false },
    { id: "2-8", title: "Create timeline for implementation", completed: false },
  ],
  "3": [
    { id: "3-1", title: "Collect Q2 sales data", completed: true },
    { id: "3-2", title: "Analyze profit margins", completed: true },
    { id: "3-3", title: "Compare to previous quarters", completed: true },
    { id: "3-4", title: "Create presentation slides", completed: true },
    { id: "3-5", title: "Draft executive summary", completed: false },
    { id: "3-6", title: "Prepare investor Q&A", completed: false },
  ],
  "4": [
    { id: "4-1", title: "Audit current website", completed: true },
    { id: "4-2", title: "Create wireframes", completed: true },
    { id: "4-3", title: "Design mobile views", completed: true },
    { id: "4-4", title: "Update product photography", completed: false },
    { id: "4-5", title: "Implement checkout improvements", completed: false },
    { id: "4-6", title: "SEO optimization", completed: false },
    { id: "4-7", title: "User testing", completed: false },
    { id: "4-8", title: "Browser compatibility testing", completed: false },
    { id: "4-9", title: "Performance optimization", completed: false },
    { id: "4-10", title: "Launch new site", completed: false },
  ],
  "5": [
    { id: "5-1", title: "Research relevant influencers", completed: true },
    { id: "5-2", title: "Create campaign brief", completed: true },
    { id: "5-3", title: "Negotiate contracts", completed: true },
    { id: "5-4", title: "Develop content guidelines", completed: true },
    { id: "5-5", title: "Ship products to influencers", completed: true },
    { id: "5-6", title: "Review content drafts", completed: false },
    { id: "5-7", title: "Coordinate posting schedule", completed: false },
    { id: "5-8", title: "Track campaign metrics", completed: false },
  ],
};

// Sample data
export const initialProjects: Project[] = [
  {
    id: "1",
    title: "Summer Collection Launch",
    category: "business",
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    description: "Plan and execute the summer collection launch including photoshoot, marketing materials, and store event",
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
    description: "Redesign store layout and implement new display concepts",
    progress: 20,
    tasks: {
      total: 8,
      completed: 2
    }
  },
  {
    id: "3",
    title: "Q2 Financial Review",
    category: "finance",
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    description: "Analyze Q2 performance and prepare report for investors",
    progress: 75,
    tasks: {
      total: 6,
      completed: 4
    }
  },
  {
    id: "4",
    title: "Website Redesign",
    category: "design",
    dueDate: new Date(Date.now() + 86400000 * 45).toISOString(),
    description: "Update online store with new branding and improved UX",
    progress: 30,
    tasks: {
      total: 10,
      completed: 3
    }
  },
  {
    id: "5",
    title: "Influencer Campaign",
    category: "business",
    dueDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    description: "Coordinate with influencers for the new collection promotion",
    progress: 60,
    tasks: {
      total: 8,
      completed: 5
    }
  }
];
