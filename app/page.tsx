"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GaugeCircle, AlertTriangle, Activity, Thermometer, Wind, Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Type definitions
type SensorData = {
  [key: string]: number;
};

type Category = {
  name: string;
  label: string;
  color: string;
  threshold: number;
  icon: React.ElementType;
};

type ChartConfig = {
  value: {
    label: string;
    color: string;
  };
  threshold: {
    label: string;
    color: string;
  };
};

type SensorProgressBarProps = {
  value: number;
  threshold: number;
  color: string;
};

type CustomAreaChartProps = {
  data: SensorData[];
  categories: Category[];
};

type CustomPieChartProps = {
  data: { name: string; value: number }[];
};

type CustomLineChartProps = {
  data: SensorData[];
  categories: Category[];
};

type CustomBarChartProps = {
  data: { name: string; value: number; threshold: number }[];
};

const categories: Category[] = [
  {
    name: "alcohol",
    label: "Alcohol",
    color: "hsl(var(--chart-1))",
    threshold: 80,
    icon: Droplets
  },
  {
    name: "ammonia",
    label: "Ammonia",
    color: "hsl(var(--chart-2))",
    threshold: 40,
    icon: Wind
  },
  {
    name: "carbonmonoxide",
    label: "Carbon Monoxide",
    color: "hsl(var(--chart-3))",
    threshold: 100,
    icon: Activity
  },
  {
    name: "carbondioxide",
    label: "Carbon Dioxide",
    color: "hsl(var(--chart-4))",
    threshold: 800,
    icon: Thermometer
  },
];

// Custom Progress Bar component for sensor cards
const SensorProgressBar: React.FC<SensorProgressBarProps> = ({ value, threshold, color }) => {
  const percentage = (value / threshold) * 100;

  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(percentage, 100)}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

// Custom Area Chart component
const CustomAreaChart: React.FC<CustomAreaChartProps> = ({ data, categories }) => {
  const chartConfig: ChartConfig = {
    value: {
      label: "Current Value",
      color: "hsl(var(--chart-1))",
    },
    threshold: {
      label: "Threshold",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => `${time.toString().padStart(2, '0')}:00`} // Format numeric time to "HH:00"
          />
          <YAxis />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          {categories.map((category) => (
            <Area
              key={category.name}
              type="monotone"
              dataKey={category.name}
              name={category.label}
              stackId="1"
              fill={category.color}
              stroke={category.color}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
// Custom Pie Chart component
const CustomPieChart: React.FC<CustomPieChartProps> = ({ data }) => {
  const chartConfig: ChartConfig = {
    value: {
      label: "Current Value",
      color: "hsl(var(--chart-1))",
    },
    threshold: {
      label: "Threshold",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categories[index].color} />
            ))}
          </Pie>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Custom Line Chart component
const CustomLineChart: React.FC<CustomLineChartProps> = ({ data, categories }) => {
  const chartConfig: ChartConfig = {
    value: {
      label: "Current Value",
      color: "hsl(var(--chart-1))",
    },
    threshold: {
      label: "Threshold",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => `${time.toString().padStart(2, '0')}:00`} // Format numeric time to "HH:00"
          />
          <YAxis />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          {categories.map((category) => (
            <Line
              key={category.name}
              type="monotone"
              dataKey={category.name}
              name={category.label}
              stroke={category.color}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
// Custom Bar Chart component with updated styling
const CustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => {
  const chartConfig: ChartConfig = {
    value: {
      label: "Current Value",
      color: "hsl(var(--chart-1))",
    },
    threshold: {
      label: "Threshold",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="value"
            fill="var(--color-desktop)"
            radius={8}
            name="Current Value"
          />
          <Bar
            dataKey="threshold"
            fill="hsl(var(--chart-2))"
            radius={8}
            name="Threshold"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Generate data function
const generateData = (): SensorData[] => {
  const data: SensorData[] = [];
  const seed = 123;
  for (let i = 0; i < 24; i++) {
    data.push({
      time: i, // Use numeric time (0 to 23)
      alcohol: 50 + Math.sin(i * 0.5 + seed) * 30,
      ammonia: 25 + Math.cos(i * 0.3 + seed) * 15,
      carbonmonoxide: 75 + Math.sin(i * 0.4 + seed) * 45,
      carbondioxide: 500 + Math.cos(i * 0.6 + seed) * 300,
    });
  }
  return data;
};
export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSensorData(generateData());
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const latestData = sensorData[sensorData.length - 1] || {
    time: 0, // Numeric time
    alcohol: 0,
    ammonia: 0,
    carbonmonoxide: 0,
    carbondioxide: 0,
  };

  const alertsCount = categories.reduce((count, category) => {
    return count + (latestData[category.name] > category.threshold ? 1 : 0);
  }, 0);

  const barChartData = categories.map(cat => ({
    name: cat.label,
    value: latestData[cat.name],
    threshold: cat.threshold
  }));

  const pieChartData = categories.map(cat => ({
    name: cat.label,
    value: latestData[cat.name]
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Environmental Sensor Dashboard</h2>
      </div>

      {alertsCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {`${alertsCount} sensor${alertsCount > 1 ? 's' : ''} exceeded threshold values!`}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ name, label, color, threshold, icon: Icon }) => {
              const value = latestData[name];
              const isAlert = value > threshold;
              const trend = value > threshold ? <TrendingUp className="h-4 w-4 text-destructive" /> : <TrendingDown className="h-4 w-4 text-primary" />;

              return (
                <Card key={name} className={isAlert ? "border-destructive" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                    </CardTitle>
                    {isAlert ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <GaugeCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {value.toFixed(1)} ppm
                      </div>
                      <SensorProgressBar
                        value={value}
                        threshold={threshold}
                        color={color}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      {value > threshold ? "Above" : "Below"} threshold {trend}
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Threshold: {threshold} ppm
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>24-Hour Trend</CardTitle>
                <CardDescription>
                  Sensor readings over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomLineChart data={sensorData} categories={categories} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Current Levels</CardTitle>
                <CardDescription>
                  Latest sensor readings vs thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomBarChart data={barChartData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Values vs Thresholds</CardTitle>
                <CardDescription>
                  Current readings compared to thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomBarChart data={barChartData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Analysis</CardTitle>
                <CardDescription>
                  Current sensor value distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={pieChartData} />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Cumulative Readings</CardTitle>
                <CardDescription>
                  Stacked area chart showing cumulative sensor values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomAreaChart data={sensorData} categories={categories} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Status</CardTitle>
              <CardDescription>
                Sensors exceeding threshold values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map(({ name, label, threshold }) => (
                  latestData[name] > threshold && (
                    <Alert key={name} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {`${label} level (${latestData[name].toFixed(1)} ppm) exceeds threshold (${threshold} ppm) at ${latestData.time.toString().padStart(2, '0')}:00`}
                      </AlertDescription>
                    </Alert>
                  )
                ))}
                {alertsCount === 0 && (
                  <Alert>
                    <AlertDescription>
                      All sensors are operating within normal parameters.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}