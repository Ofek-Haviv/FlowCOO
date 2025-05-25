
import * as React from "react";
import {
  Bar,
  Line,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";

// Types for the chart components
interface ChartProps {
  data: any[];
  xAxisKey?: string;
  series: {
    key: string;
    label?: string;
    color?: string;
  }[];
}

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors: string[];
}

export const BarChart: React.FC<ChartProps> = ({ data, xAxisKey = "name", series }) => {
  const chartConfig = series.reduce((config, item) => ({
    ...config,
    [item.key]: {
      label: item.label || item.key,
      color: item.color || "#0088FE",
    },
  }), {});

  return (
    <ChartContainer config={chartConfig}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        {series.map((s) => (
          <Bar 
            key={s.key} 
            dataKey={s.key} 
            name={s.label || s.key} 
            fill={s.color || "#0088FE"} 
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export const LineChart: React.FC<ChartProps> = ({ data, xAxisKey = "name", series }) => {
  const chartConfig = series.reduce((config, item) => ({
    ...config,
    [item.key]: {
      label: item.label || item.key,
      color: item.color || "#0088FE",
    },
  }), {});

  return (
    <ChartContainer config={chartConfig}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis dataKey={xAxisKey} hide />
        <YAxis hide />
        <Tooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Line 
            key={s.key} 
            type="monotone" 
            dataKey={s.key} 
            name={s.label || s.key} 
            stroke={s.color || "#0088FE"} 
            activeDot={{ r: 8 }} 
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

export const PieChart: React.FC<PieChartProps> = ({ data, dataKey, nameKey, colors }) => {
  const chartConfig = data.reduce((config, item, index) => ({
    ...config,
    [item[nameKey]]: {
      label: item[nameKey],
      color: colors[index % colors.length],
    },
  }), {});

  return (
    <ChartContainer config={chartConfig}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
      </RechartsPieChart>
    </ChartContainer>
  );
};
