
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ExecutiveStats from '@/components/ExecutiveStats';
import { Executive, ExecutiveStats as ExecutiveStatsType } from '@/utils/types';
import { useToast } from '@/components/ui/use-toast';
import HourlyCallVolumeChart from '@/components/HourlyCallVolumeChart';
import CallDurationChart from '@/components/CallDurationChart';
import ResolutionGaugeChart from '@/components/ResolutionGaugeChart';

const ExecutiveDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [stats, setStats] = useState<ExecutiveStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch the executive details from an API
    // For demonstration purposes, we're using mock data
    const fetchExecutiveDetails = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for a single executive
        const mockExecutive: Executive = {
          id: id || '1',
          name: 'Jane Smith',
          department: 'Customer Support',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 123-4567',
          avatar: 'https://i.pravatar.cc/150?u=jane',
          performance: 92,
          totalCalls: 1245,
          resolvedCalls: 1150,
          averageHandlingTime: 4.5,
          satisfactionScore: 4.8,
          status: 'online'
        };
        
        // Mock stats data
        const mockStats: ExecutiveStatsType = {
          callsByMonth: [85, 92, 78, 95, 110, 115, 105, 128, 118, 132, 145, 155],
          resolvedRate: 92.4,
          sentimentDistribution: {
            positive: 75,
            neutral: 15,
            negative: 10
          },
          emotionsData: [
            { name: 'Satisfied', value: 58 },
            { name: 'Happy', value: 17 },
            { name: 'Neutral', value: 15 },
            { name: 'Frustrated', value: 7 },
            { name: 'Angry', value: 3 }
          ],
          dominantEmotion: 'Satisfied',
          emotionsComparisonData: [
            { name: 'Monday', customer: 65, executive: 10 },
            { name: 'Tuesday', customer: 70, executive: 20 },
            { name: 'Wednesday', customer: 75, executive: 15 },
            { name: 'Thursday', customer: 80, executive: 15 },
            { name: 'Friday', customer: 85, executive: 10 }
          ],
          topTopics: [
            { topic: 'Account Issues', count: 45 },
            { topic: 'Product Information', count: 38 },
            { topic: 'Technical Support', count: 32 },
            { topic: 'Billing Questions', count: 28 },
            { topic: 'Returns & Refunds', count: 22 }
          ]
        };
        
        setExecutive(mockExecutive);
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching executive details:', error);
        toast({
          title: 'Error',
          description: 'Could not load executive details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchExecutiveDetails();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!executive || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <p className="text-xl text-muted-foreground">Executive not found</p>
        <Button onClick={() => navigate('/executives')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Executives
        </Button>
      </div>
    );
  }

  // Sample data for CallDurationChart
  const callDurationData = [
    { duration: '0-1 min', count: 45 },
    { duration: '1-3 min', count: 87 },
    { duration: '3-5 min', count: 123 },
    { duration: '5-10 min', count: 68 },
    { duration: '10+ min', count: 32 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/executives')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{executive.name}</h1>
          <p className="text-muted-foreground">
            Executive Performance Dashboard
          </p>
        </div>
      </div>
      
      <ExecutiveStats executive={executive} stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HourlyCallVolumeChart 
          title="Hourly Call Distribution"
          subtitle="Number of calls by hour of day"
        />
        
        <CallDurationChart 
          data={callDurationData}
          title="Call Duration Distribution"
          subtitle="Duration breakdown of handled calls"
        />
        
        <ResolutionGaugeChart 
          value={92}
          title="First Call Resolution Rate"
          subtitle="Percentage of issues resolved on first contact"
        />
      </div>
    </div>
  );
};

export default ExecutiveDetails;
