
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ProductivityRadarChartProps {
  title: string;
  subtitle: string;
  data?: { 
    subject: string; 
    A: number; 
    B?: number;
    fullMark: number 
  }[];
  executives?: string[];
}

const ProductivityRadarChart: React.FC<ProductivityRadarChartProps> = ({ 
  title, 
  subtitle, 
  data = [
    { subject: 'Call Volume', A: 85, B: 65, fullMark: 100 },
    { subject: 'Response Time', A: 90, B: 80, fullMark: 100 },
    { subject: 'Handling Time', A: 75, B: 95, fullMark: 100 },
    { subject: 'Resolution Rate', A: 88, B: 76, fullMark: 100 },
    { subject: 'Satisfaction', A: 92, B: 84, fullMark: 100 },
    { subject: 'Sentiment', A: 78, B: 90, fullMark: 100 },
  ],
  executives = ['This Executive', 'Team Average']
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              />
              <Radar
                name={executives[0]}
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              {data[0].B !== undefined && (
                <Radar
                  name={executives[1]}
                  dataKey="B"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              )}
              <Tooltip 
                formatter={(value: number) => [`${value}%`, '']}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityRadarChart;
