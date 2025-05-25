
import { Task } from "../TaskCard";
import { Project } from "../ProjectCard";
import { DashboardMetric } from "./DashboardMetrics";

// Sample data
export const initialTasks: Task[] = [
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
  },
];

export const projects: Project[] = [
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
  }
];

export const businessMetrics: DashboardMetric[] = [
  { title: "Sales This Week", value: "₪8,254", change: "+12%", increasing: true },
  { title: "New Customers", value: 24, change: "+5%", increasing: true },
  { title: "Inventory Items", value: 156, change: "-3%", increasing: false },
  { title: "Website Visits", value: 1289, change: "+18%", increasing: true },
];
