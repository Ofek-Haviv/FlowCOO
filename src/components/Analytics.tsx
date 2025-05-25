import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface AnalyticsProps {
  data: {
    revenue: number[];
    orders: number[];
    customers: number[];
    dates: string[];
  };
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

type DateRange = {
  from: Date;
  to: Date;
};

type PresetRange = '7d' | '30d' | '90d' | '1y' | 'custom';

export const Analytics = ({ data, onDateRangeChange }: AnalyticsProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [presetRange, setPresetRange] = useState<PresetRange>('30d');
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePresetChange = (preset: PresetRange) => {
    setPresetRange(preset);
    const now = new Date();
    let from: Date;

    switch (preset) {
      case '7d':
        from = subDays(now, 7);
        break;
      case '30d':
        from = subDays(now, 30);
        break;
      case '90d':
        from = subDays(now, 90);
        break;
      case '1y':
        from = subYears(now, 1);
        break;
      case 'custom':
        return; // Don't change dates for custom range
    }

    const newRange = { from, to: now };
    setDateRange(newRange);
    onDateRangeChange(from, now);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getMetricColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={presetRange} onValueChange={(value: PresetRange) => handlePresetChange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          {presetRange === 'custom' && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "LLL dd, y") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => {
                      if (date) {
                        const newRange = { ...dateRange, from: date };
                        setDateRange(newRange);
                        onDateRangeChange(date, newRange.to);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "LLL dd, y") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => {
                      if (date) {
                        const newRange = { ...dateRange, to: date };
                        setDateRange(newRange);
                        onDateRangeChange(newRange.from, date);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.revenue.reduce((a, b) => a + b, 0))}
            </div>
            <p className={cn(
              "text-xs",
              getMetricColor(calculateGrowth(
                data.revenue[data.revenue.length - 1],
                data.revenue[0]
              ))
            )}>
              {formatPercentage(calculateGrowth(
                data.revenue[data.revenue.length - 1],
                data.revenue[0]
              ))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.orders.reduce((a, b) => a + b, 0)}
            </div>
            <p className={cn(
              "text-xs",
              getMetricColor(calculateGrowth(
                data.orders[data.orders.length - 1],
                data.orders[0]
              ))
            )}>
              {formatPercentage(calculateGrowth(
                data.orders[data.orders.length - 1],
                data.orders[0]
              ))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.customers.reduce((a, b) => a + b, 0)}
            </div>
            <p className={cn(
              "text-xs",
              getMetricColor(calculateGrowth(
                data.customers[data.customers.length - 1],
                data.customers[0]
              ))
            )}>
              {formatPercentage(calculateGrowth(
                data.customers[data.customers.length - 1],
                data.customers[0]
              ))}
            </p>
          </CardContent>
        </Card>
      </div>

      {isExpanded && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your chart component here */}
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Revenue chart placeholder
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Distribution</CardTitle>
              <CardDescription>Orders by category</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your chart component here */}
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Order distribution chart placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 