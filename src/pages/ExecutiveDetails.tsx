
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { executives, generateExecutiveStats } from '@/utils/mockData';
import { Executive, ExecutiveStats as ExecutiveStatsType } from '@/utils/types';
import ExecutiveStats from '@/components/ExecutiveStats';
import { ArrowLeft } from 'lucide-react';

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
      
      <ExecutiveStats executive={executive} stats={stats} />
    </div>
  );
};

export default ExecutiveDetails;
