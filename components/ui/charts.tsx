import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar, Cell, PieChart, Pie, RadialBarChart, RadialBar } from 'recharts';

// Common chart props and types
type ChartCategory = {
  name: string;
  label: string;
  color: string;
  threshold?: number;
};

// Custom Axis components to avoid defaultProps warnings
const CustomXAxis = (props: any) => <XAxis {...props} />;
const CustomYAxis = (props: any) => <YAxis {...props} />;

export function AreaChart({ data, categories }: { data: any[], categories: ChartCategory[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <CustomXAxis dataKey="time" />
        <CustomYAxis />
        <Tooltip />
        {categories.map((category) => (
          <Area
            key={category.name}
            type="monotone"
            dataKey={category.name}
            name={category.label}
            stroke={category.color}
            fill={category.color}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export function BarChart({ 
  data, 
  categories, 
  stacked = false,
  layout = "horizontal" 
}: { 
  data: any[], 
  categories: ChartCategory[], 
  stacked?: boolean,
  layout?: "horizontal" | "vertical"
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={data} layout={layout}>
        <CartesianGrid strokeDasharray="3 3" />
        <CustomXAxis 
          type={layout === "horizontal" ? "category" : "number"} 
          dataKey={layout === "horizontal" ? "time" : undefined}
        />
        <CustomYAxis 
          type={layout === "vertical" ? "category" : "number"}
          dataKey={layout === "vertical" ? "name" : undefined}
        />
        <Tooltip />
        {categories.map((category) => (
          <Bar
            key={category.name}
            dataKey={category.name}
            name={category.label}
            fill={category.color}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data }: { data: { name: string; value: number; color: string; }[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function GaugeChart({ 
  value, 
  max, 
  threshold,
  label,
  color 
}: { 
  value: number; 
  max: number; 
  threshold: number;
  label: string;
  color: string;
}) {
  const data = [
    {
      value: Math.min(value, max),
      fill: value > threshold ? '#ef4444' : color,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="100%"
        innerRadius="80%"
        outerRadius="100%"
        barSize={10}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          background
          dataKey="value"
          cornerRadius={30 / 2}
          max={max}
        />
        <text
          x="50%"
          y="90%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-medium"
        >
          {`${value.toFixed(1)} ${label}`}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}