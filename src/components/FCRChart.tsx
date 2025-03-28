
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FCRChartProps {
  title: string;
  subtitle: string;
  data?: { category: string; rate: number }[];
}

const FCRChart: React.FC<FCRChartProps> = ({ 
  title, 
  subtitle, 
  data = [
    { category: 'Technical', rate: 85 },
    { category: 'Billing', rate: 78 },
    { category: 'General', rate: 92 },
    { category: 'Product', rate: 65 },
    { category: 'Support', rate: 88 }
  ] // Default data if none provided
}) => {
  const getBarColor = (rate: number) => {
    if (rate >= 90) return '#10b981'; // green
    if (rate >= 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };
  
  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-card to-background rounded-t-lg">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
              barSize={36}
              animationDuration={1500}
              animationBegin={300}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'FCR Rate']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
              />
              <Bar 
                dataKey="rate" 
                radius={[6, 6, 0, 0]}
                name="Resolution Rate"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          <span className="font-medium text-foreground">Average FCR Rate:</span> 
          <span className="ml-2 text-lg font-bold text-primary">
            {Math.round(data.reduce((sum, item) => sum + item.rate, 0) / data.length)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FCRChart;
