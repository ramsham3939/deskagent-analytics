
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { executives, generateExecutiveStats } from '@/utils/mockData';
import { Executive, ExecutiveStats as ExecutiveStatsType } from '@/utils/types';
import ExecutiveStats from '@/components/ExecutiveStats';
import { ArrowLeft } from 'lucide-react';
import CallEfficiencyChart from '@/components/CallEfficiencyChart';
import PerformanceKPIChart from '@/components/PerformanceKPIChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ExecutiveDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [stats, setStats] = useState<ExecutiveStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutive = () => {
      setLoading(true);
      // Find executive in mock data
      const foundExecutive = executives.find((e) => e.id === id);
      
      if (foundExecutive) {
        setExecutive(foundExecutive);
        
        try {
          // Generate stats for the executive
          const executiveStats = generateExecutiveStats(foundExecutive.id);
          setStats(executiveStats);
        } catch (error) {
          console.error('Error generating stats:', error);
        }
      }
      
      setLoading(false);
    };

    fetchExecutive();
  }, [id]);

  const handleBack = () => {
    navigate('/executives');
  };

  // Generate call efficiency data based on the executive
  const generateCallEfficiencyData = () => {
    if (!executive) return [];
    
    // Create call efficiency data with random but realistic values
    return [
      { 
        category: 'Technical', 
        resolved: Math.min(95, Math.floor(60 + (executive.performance / 10))), 
        pending: Math.max(5, Math.floor(40 - (executive.performance / 10)))
      },
      { 
        category: 'Billing', 
        resolved: Math.min(95, Math.floor(65 + (executive.performance / 8))), 
        pending: Math.max(5, Math.floor(35 - (executive.performance / 8)))
      },
      { 
        category: 'Product', 
        resolved: Math.min(95, Math.floor(55 + (executive.performance / 9))), 
        pending: Math.max(5, Math.floor(45 - (executive.performance / 9)))
      },
      { 
        category: 'General', 
        resolved: Math.min(95, Math.floor(70 + (executive.performance / 7))), 
        pending: Math.max(5, Math.floor(30 - (executive.performance / 7)))
      }
    ];
  };

  // Generate KPI data for the radar chart
  const generateKPIData = () => {
    if (!executive || !stats) return [];
    
    const baseValue = (executive.performance / 100) * 80; // Base value derived from performance
    
    return [
      { subject: 'Efficiency', value: Math.floor(baseValue + Math.random() * 20), fullMark: 100 },
      { subject: 'Resolution', value: Math.floor(stats.resolvedRate), fullMark: 100 },
      { subject: 'Satisfaction', value: Math.floor(executive.satisfactionScore * 10), fullMark: 100 },
      { subject: 'Speed', value: Math.floor(100 - (executive.averageHandlingTime * 5)), fullMark: 100 },
      { subject: 'Accuracy', value: Math.floor(baseValue + Math.random() * 15), fullMark: 100 },
      { subject: 'Empathy', value: Math.floor(baseValue + Math.random() * 15), fullMark: 100 },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="mt-4 h-4 w-32 bg-muted rounded"></div>
          <div className="mt-2 h-3 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!executive || !stats) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Executives
        </Button>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold">Executive Not Found</h2>
          <p className="text-muted-foreground">The executive you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Additional performance metrics to show
  const additionalMetrics = [
    { name: 'Calls Per Day', value: Math.floor(stats.totalCalls / 30), format: '', color: 'text-blue-500' },
    { name: 'Avg Call Duration', value: executive.averageHandlingTime, format: 'min', color: 'text-purple-500' },
    { name: 'Resolution Rate', value: Math.round(stats.resolvedRate), format: '%', color: 'text-green-500' },
    { name: 'Customer Retention', value: Math.floor(70 + (executive.performance / 4)), format: '%', color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Executives
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{executive.name}</h1>
          <p className="text-muted-foreground">
            Detailed performance metrics and statistics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`h-3 w-3 rounded-full ${
              executive.status === 'online'
                ? 'bg-green-500'
                : executive.status === 'away'
                ? 'bg-yellow-500'
                : 'bg-gray-300'
            }`}
          />
          <span
            className={
              executive.status === 'online'
                ? 'text-green-600'
                : executive.status === 'away'
                ? 'text-yellow-600'
                : 'text-gray-500'
            }
          >
            {executive.status.charAt(0).toUpperCase() + executive.status.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Additional Metrics Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Performance At-a-Glance</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalMetrics.map((metric, index) => (
              <div key={index} className="bg-secondary/30 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">{metric.name}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}{metric.format}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* New charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CallEfficiencyChart data={generateCallEfficiencyData()} />
        <PerformanceKPIChart 
          data={generateKPIData()} 
          title={`${executive.name}'s Performance KPIs`}
          subtitle="Key performance indicators by area"
        />
      </div>
      
      <ExecutiveStats executive={executive} stats={stats} />
    </div>
  );
};

export default ExecutiveDetails;
