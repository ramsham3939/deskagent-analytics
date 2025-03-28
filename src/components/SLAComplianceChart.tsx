
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SLAComplianceChartProps {
  title: string;
  subtitle: string;
  compliance?: number;
  target?: number;
}

const SLAComplianceChart: React.FC<SLAComplianceChartProps> = ({ 
  title, 
  subtitle, 
  compliance = 85, 
  target = 90 
}) => {
  // Define colors based on compliance level
  const getColor = () => {
    if (compliance >= target) return 'text-green-600';
    if (compliance >= target * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get difference from target
  const targetDiff = compliance - target;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute h-36 w-36 rounded-full border-8 border-muted"></div>
            
            {/* Colored circle with stroke-dasharray for percentage */}
            <svg className="absolute h-40 w-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                strokeWidth="8"
                stroke="currentColor"
                className={getColor()}
                strokeDasharray={`${compliance * 3.78} 1000`}
              />
            </svg>
            
            <div className="text-center z-10">
              <p className={`text-3xl font-bold ${getColor()}`}>{compliance}%</p>
              <p className="text-xs text-muted-foreground">of target {target}%</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">SLA Compliance Score</p>
            <p className={`text-sm font-medium ${getColor()}`}>
              {targetDiff >= 0 
                ? `${targetDiff > 0 ? '+' : ''}${targetDiff}% above target` 
                : `${targetDiff}% below target`}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current: {compliance}%</span>
            <span className="text-muted-foreground">Target: {target}%</span>
          </div>
          <Progress value={compliance} className="h-2" />
          
          <div className="text-xs text-muted-foreground mt-4">
            <p>24h Trend: {Math.random() > 0.5 ? '+1.2%' : '-0.8%'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SLAComplianceChart;
