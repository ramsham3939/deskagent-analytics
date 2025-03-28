
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CallTransferChartProps {
  title: string;
  subtitle: string;
  transferRate?: number;
}

const CallTransferChart: React.FC<CallTransferChartProps> = ({ 
  title, 
  subtitle, 
  transferRate = 15 // Default value if none provided
}) => {
  // Calculate the non-transfer rate
  const nonTransferRate = 100 - transferRate;
  
  const data = [
    { name: 'Transferred', value: transferRate },
    { name: 'Not Transferred', value: nonTransferRate }
  ];
  
  const COLORS = ['#8884d8', '#82ca9d'];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Percentage']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-lg font-bold">{transferRate}%</p>
            <p className="text-sm text-muted-foreground">Calls Transferred</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallTransferChart;
