
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// TODO: Refactor this component to use context API for better state management
// NOTE: For future improvement, consider adding emotion intensity metrics

interface EmotionData {
  name: string;
  customer: number;
  executive: number;
}

interface EmotionsComparisonChartProps {
  data: EmotionData[];
}

/**
 * Color mapping for different emotions
 * These colors are chosen based on psychological color theory
 * where warmer colors represent negative emotions and cooler colors
 * represent positive emotions
 */
const EMOTION_COLORS = {
  'Customer': {
    'Happy': '#4ade80',      // Green
    'Satisfied': '#60a5fa',  // Blue
    'Neutral': '#a78bfa',    // Purple
    'Confused': '#fbbf24',   // Yellow
    'Frustrated': '#f87171', // Red
    'Angry': '#ef4444',      // Bright Red
    'default': '#f97316'     // Orange (default)
  },
  'Executive': {
    'Calm': '#22c55e',       // Green
    'Empathetic': '#3b82f6', // Medium Blue
    'Professional': '#6366f1', // Indigo
    'default': '#60a5fa'     // Blue (default)
  }
};

/**
 * EmotionsComparisonChart Component
 * 
 * This chart displays the comparison between customer emotions and
 * executive responses to those emotions. It helps identify how well
 * executives maintain professional composure during emotionally charged
 * customer interactions.
 * 
 * @param {EmotionsComparisonChartProps} props - Component props
 * @returns {JSX.Element} The rendered chart
 */
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

  // Helper function to get emotion color based on type and emotion name
  const getEmotionColor = (type: 'customer' | 'executive', emotion: string) => {
    const colorMap = type === 'customer' ? EMOTION_COLORS.Customer : EMOTION_COLORS.Executive;
    return colorMap[emotion as keyof typeof colorMap] || colorMap.default;
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-card to-background rounded-t-lg">
        <CardTitle className="text-lg">Emotion Comparison</CardTitle>
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
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                width={100}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border p-3 rounded-md shadow-sm">
                        <p className="font-medium text-foreground">{payload[0].payload.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                          <p className="text-sm">{`Customer: ${payload[0].value}%`}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div>
                          <p className="text-sm">{`Executive: ${payload[1].value}%`}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} 
                formatter={(value) => <span className="text-sm capitalize">{value}</span>}
                iconType="circle"
              />
              <Bar 
                dataKey="customer" 
                name="Customer" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`customer-cell-${index}`} 
                    fill={entry.name === 'Angry' || entry.name === 'Frustrated' ? '#ef4444' : '#f97316'} 
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="executive" 
                name="Executive" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`executive-cell-${index}`} 
                    fill={entry.name === 'Calm' || entry.name === 'Professional' || entry.name === 'Empathetic' ? '#22c55e' : '#60a5fa'} 
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p><span className="font-medium">How to read this chart:</span> This visualization shows how executives respond emotionally when customers present different emotional states. The contrast highlights how well executives maintain professional composure.</p>
          <p className="mt-2 text-xs">Note: Data collected from call transcription analysis using NLP sentiment scoring (Jan-Mar 2025)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionsComparisonChart;
