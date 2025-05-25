import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface Metric {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  userId: string;
}

interface MetricCardProps {
  metric: Metric;
  onEdit: (metric: Metric) => void;
  onDelete: (id: string) => void;
}

export function MetricCard({ metric, onEdit, onDelete }: MetricCardProps) {
  const progress = (metric.value / metric.target) * 100;
  const isPositive = metric.trend === 'up';
  const isNegative = metric.trend === 'down';

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(metric)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(metric.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metric.value} {metric.unit}
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Target: {metric.target} {metric.unit}</span>
          <span className={`${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-yellow-500'}`}>
            {metric.change}%
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardContent>
    </Card>
  );
} 