
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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'FCR Rate']}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Bar 
                dataKey="rate" 
                radius={[4, 4, 0, 0]}
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
          Average FCR Rate: {Math.round(data.reduce((sum, item) => sum + item.rate, 0) / data.length)}%
        </div>
      </CardContent>
    </Card>
  );
};

export default FCRChart;
