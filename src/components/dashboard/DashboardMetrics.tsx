
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  increasing?: boolean;
}

interface DashboardMetricsProps {
  metrics: DashboardMetric[];
}

const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{metric.value}</span>
              {metric.change && (
                <span className={`text-xs font-medium ${metric.increasing ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
