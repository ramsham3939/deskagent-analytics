
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface EmotionData {
  name: string;
  customer: number;
  executive: number;
}

interface EmotionsComparisonChartProps {
  data: EmotionData[];
}

const EMOTION_COLORS = {
  'Happy': '#4ade80',      // Green
  'Satisfied': '#60a5fa',  // Blue
  'Neutral': '#a78bfa',    // Purple
  'Confused': '#fbbf24',   // Yellow
  'Frustrated': '#f87171', // Red
  'Angry': '#ef4444',      // Bright Red
  'Calm': '#22c55e',       // Green
  'Empathetic': '#3b82f6', // Medium Blue
  'Professional': '#6366f1' // Indigo
};

const EmotionsComparisonChart: React.FC<EmotionsComparisonChartProps> = ({ data }) => {
  // Default data that demonstrates the contrast between customer and executive emotions
  const chartData = data || [
    { name: 'Angry', customer: 65, executive: 5 },
    { name: 'Frustrated', customer: 40, executive: 10 },
    { name: 'Confused', customer: 30, executive: 15 },
    { name: 'Neutral', customer: 25, executive: 25 },
    { name: 'Calm', customer: 15, executive: 70 },
    { name: 'Professional', customer: 10, executive: 60 },
    { name: 'Empathetic', customer: 5, executive: 45 }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Emotion Comparison</CardTitle>
        <CardDescription>
          How executives respond to different customer emotional states
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 30,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                width={100}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p className="text-sm text-[#f97316]">{`Customer: ${payload[0].value}%`}</p>
                        <p className="text-sm text-[#60a5fa]">{`Executive: ${payload[1].value}%`}</p>
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
                fill="#f97316" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`customer-cell-${index}`} 
                    fill={entry.name === 'Angry' || entry.name === 'Frustrated' ? '#ef4444' : '#f97316'} 
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="executive" 
                name="Executive" 
                fill="#60a5fa" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`executive-cell-${index}`} 
                    fill={entry.name === 'Calm' || entry.name === 'Professional' || entry.name === 'Empathetic' ? '#22c55e' : '#60a5fa'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionsComparisonChart;
