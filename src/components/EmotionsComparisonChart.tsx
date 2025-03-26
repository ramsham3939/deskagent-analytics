
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmotionData {
  name: string;
  customer: number;
  executive: number;
}

interface EmotionsComparisonChartProps {
  data: EmotionData[];
}

const EmotionsComparisonChart: React.FC<EmotionsComparisonChartProps> = ({ data }) => {
  const chartData = data || [
    { name: 'Happy', customer: 30, executive: 35 },
    { name: 'Satisfied', customer: 25, executive: 30 },
    { name: 'Neutral', customer: 20, executive: 15 },
    { name: 'Confused', customer: 15, executive: 10 },
    { name: 'Frustrated', customer: 10, executive: 5 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Emotion Comparison</CardTitle>
        <CardDescription>
          Customer emotions vs. Executive emotions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p className="text-sm text-[#60a5fa]">{`Customer: ${payload[0].value}`}</p>
                        <p className="text-sm text-[#f97316]">{`Executive: ${payload[1].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} 
                formatter={(value) => <span className="text-sm capitalize">{value}</span>}
              />
              <Bar 
                dataKey="customer" 
                name="Customer" 
                fill="#60a5fa" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
              <Bar 
                dataKey="executive" 
                name="Executive" 
                fill="#f97316" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionsComparisonChart;
