import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle, TrendingUp, ShoppingCart, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import DailyReview from '../components/DailyReview';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import TasksSection from '../components/dashboard/TasksSection';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import ClickUpDashboard from '../components/ClickUpDashboard';
import { initialTasks, businessMetrics } from '../components/dashboard/data';
import { Task } from '../components/TaskCard';
import DashboardMetrics, { DashboardMetric } from '../components/dashboard/DashboardMetrics';
import { Project } from '../components/ProjectCard';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '../components/ui/table';

interface FinancialData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: number;
    totalPrice: string;
    createdAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
  }>;
  salesThisWeek?: number;
  newCustomersThisWeek?: number;
  inventoryItems?: number;
  websiteVisitsThisWeek?: number;
  salesMonthToDate?: number;
  openOrdersCount?: number;
  prevNewCustomersThisWeek?: number;
  prevOpenOrdersCount?: number;
  prevWebsiteVisitsThisWeek?: number;
}

const Index = () => {
  const [showReview, setShowReview] = useState(false);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clickUpConnected, setClickUpConnected] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>([]);
  const { token } = useAuth();
  const { user } = useAuth();

  // Prepare metrics, override with real Shopify data if available
  let metrics: DashboardMetric[] = businessMetrics;
  if (financialData) {
    // Calculate real percentage changes
    const getPercentChange = (current: number, previous: number) => {
      if (previous === 0) return current === 0 ? '+0%' : '+100%';
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? '+' : '';
      return `${sign}${change.toFixed(0)}%`;
    };

    // Calculate previous month sales
    let prevMonthSales = 0;
    if (financialData.monthlyRevenue && financialData.monthlyRevenue.length > 1) {
      prevMonthSales = financialData.monthlyRevenue[financialData.monthlyRevenue.length - 2].revenue;
    }
    // Calculate previous week new customers (mock: use 0 if not available)
    const prevNewCustomers = financialData.prevNewCustomersThisWeek ?? 0;
    // Calculate previous open orders (mock: use 0 if not available)
    const prevOpenOrders = financialData.prevOpenOrdersCount ?? 0;
    // Calculate previous website visits (mock: use 0 if not available)
    const prevWebsiteVisits = financialData.prevWebsiteVisitsThisWeek ?? 0;

    metrics = businessMetrics.map(metric => {
      if (metric.title === 'Sales This Week' || metric.title === 'Sales Month to Date') {
        return {
          ...metric,
          title: 'Sales Month to Date',
          value: `₪${(financialData.salesMonthToDate ?? 0).toLocaleString()}`,
          change: getPercentChange(financialData.salesMonthToDate ?? 0, prevMonthSales),
          increasing: (financialData.salesMonthToDate ?? 0) >= prevMonthSales
        };
      }
      if (metric.title === 'New Customers') {
        return {
          ...metric,
          value: financialData.newCustomersThisWeek ?? 0,
          change: getPercentChange(financialData.newCustomersThisWeek ?? 0, prevNewCustomers),
          increasing: (financialData.newCustomersThisWeek ?? 0) >= prevNewCustomers
        };
      }
      if (metric.title === 'Inventory Items') {
        return {
          ...metric,
          title: 'Open Orders',
          value: financialData.openOrdersCount ?? 0,
          change: getPercentChange(financialData.openOrdersCount ?? 0, prevOpenOrders),
          increasing: (financialData.openOrdersCount ?? 0) >= prevOpenOrders
        };
      }
      if (metric.title === 'Website Visits') {
        return {
          ...metric,
          value: financialData.websiteVisitsThisWeek ?? 'N/A',
          change: getPercentChange(financialData.websiteVisitsThisWeek ?? 0, prevWebsiteVisits),
          increasing: (financialData.websiteVisitsThisWeek ?? 0) >= prevWebsiteVisits
        };
      }
      return metric;
    });
  }

  const formatCurrency = (amount: number) => {
    return `₪${amount.toFixed(2)}`;
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  const handleProjectClick = (projectId: string) => {
    // Navigate to project details
    console.log('Project clicked:', projectId);
  };

  const handleConnectClickUp = () => {
    setClickUpConnected(true);
  };

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const shopifyToken = localStorage.getItem('shopify_token');
        if (!shopifyToken) {
          setLoading(false);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/shopify/finances`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Shopify-Token': shopifyToken
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch financial data');
        }

        const data = await response.json();
        setFinancialData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setError('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [token]);

  useEffect(() => {
    // Fetch projects from backend
    const fetchProjects = async () => {
      if (!user?.id) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/projects?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Today</h1>
        <p className="text-muted-foreground text-lg">
          {new Date().toLocaleDateString("he-IL", { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <DashboardMetrics metrics={metrics} />

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

      <div className="mt-6 text-center">
        <button 
          onClick={() => setShowReview(true)}
          className="mx-auto px-4 py-2 border rounded"
        >
          Start daily review
        </button>
      </div>

      {showReview && (
        <DailyReview onComplete={() => setShowReview(false)} />
      )}
    </div>
  );
};

export default Index;
