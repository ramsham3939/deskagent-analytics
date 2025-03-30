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
import CallTransferChart from '@/components/CallTransferChart';
import FCRChart from '@/components/FCRChart';
import ProductivityRadarChart from '@/components/ProductivityRadarChart';
import SLAComplianceChart from '@/components/SLAComplianceChart';
import { executives } from '@/utils/mockData';

const ExecutiveDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [stats, setStats] = useState<ExecutiveStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutiveDetails = async () => {
      try {
        setLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundExecutive = executives.find(exec => exec.id === id);
        
        if (!foundExecutive) {
          toast({
            title: "Executive not found",
            description: `No executive found with ID: ${id}`,
            variant: "destructive"
          });
          return;
        }
        
        const mockStats: ExecutiveStatsType = {
          callsByMonth: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 50),
          resolvedRate: 70 + Math.random() * 25,
          sentimentDistribution: {
            positive: Math.floor(60 + Math.random() * 20),
            neutral: Math.floor(10 + Math.random() * 20),
            negative: Math.floor(5 + Math.random() * 10)
          },
          emotionsData: [
            { name: 'Satisfied', value: Math.floor(40 + Math.random() * 30) },
            { name: 'Happy', value: Math.floor(10 + Math.random() * 20) },
            { name: 'Neutral', value: Math.floor(10 + Math.random() * 20) },
            { name: 'Frustrated', value: Math.floor(5 + Math.random() * 10) },
            { name: 'Angry', value: Math.floor(2 + Math.random() * 5) }
          ],
          dominantEmotion: 'Satisfied',
          emotionsComparisonData: [
            { name: 'Monday', customer: Math.floor(50 + Math.random() * 30), executive: Math.floor(5 + Math.random() * 20) },
            { name: 'Tuesday', customer: Math.floor(50 + Math.random() * 30), executive: Math.floor(5 + Math.random() * 20) },
            { name: 'Wednesday', customer: Math.floor(50 + Math.random() * 30), executive: Math.floor(5 + Math.random() * 20) },
            { name: 'Thursday', customer: Math.floor(50 + Math.random() * 30), executive: Math.floor(5 + Math.random() * 20) },
            { name: 'Friday', customer: Math.floor(50 + Math.random() * 30), executive: Math.floor(5 + Math.random() * 20) }
          ],
          topTopics: [
            { topic: 'Account Issues', count: Math.floor(30 + Math.random() * 20) },
            { topic: 'Product Information', count: Math.floor(25 + Math.random() * 20) },
            { topic: 'Technical Support', count: Math.floor(20 + Math.random() * 20) },
            { topic: 'Billing Questions', count: Math.floor(15 + Math.random() * 20) },
            { topic: 'Returns & Refunds', count: Math.floor(10 + Math.random() * 20) }
          ]
        };
        
        setExecutive(foundExecutive);
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

  const callDurationData = [
    { duration: '0-1 min', count: Math.floor(30 + Math.random() * 30) },
    { duration: '1-3 min', count: Math.floor(60 + Math.random() * 40) },
    { duration: '3-5 min', count: Math.floor(80 + Math.random() * 50) },
    { duration: '5-10 min', count: Math.floor(40 + Math.random() * 40) },
    { duration: '10+ min', count: Math.floor(20 + Math.random() * 20) }
  ];

  const fcrData = [
    { category: 'Technical', rate: Math.floor(70 + Math.random() * 25) },
    { category: 'Billing', rate: Math.floor(70 + Math.random() * 25) },
    { category: 'General', rate: Math.floor(80 + Math.random() * 20) },
    { category: 'Product', rate: Math.floor(65 + Math.random() * 25) },
    { category: 'Support', rate: Math.floor(75 + Math.random() * 20) }
  ];

  const transferRate = Math.floor(5 + Math.random() * 25);
  const slaCompliance = Math.floor(75 + Math.random() * 20);
  const slaTarget = 90;

  const productivityData = [
    { subject: 'Call Volume', A: Math.floor(70 + Math.random() * 30), B: 65, fullMark: 100 },
    { subject: 'Response Time', A: Math.floor(70 + Math.random() * 30), B: 80, fullMark: 100 },
    { subject: 'Handling Time', A: Math.floor(70 + Math.random() * 30), B: 95, fullMark: 100 },
    { subject: 'Resolution Rate', A: Math.floor(70 + Math.random() * 30), B: 76, fullMark: 100 },
    { subject: 'Satisfaction', A: Math.floor(70 + Math.random() * 30), B: 84, fullMark: 100 },
    { subject: 'Sentiment', A: Math.floor(70 + Math.random() * 30), B: 90, fullMark: 100 },
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
          value={Math.round(stats.resolvedRate)}
          title="First Call Resolution Rate"
          subtitle="Percentage of issues resolved on first contact"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CallTransferChart 
          title="Call Transfer Rate"
          subtitle="Percentage of calls transferred to another department"
          transferRate={transferRate}
        />
        
        <FCRChart 
          title="First Call Resolution Rate by Category"
          subtitle="Percentage of issues resolved without follow-up"
          data={fcrData}
        />
        
        <SLAComplianceChart 
          title="SLA Compliance Rate"
          subtitle="Percentage of calls resolved within committed time"
          compliance={slaCompliance}
          target={slaTarget}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <ProductivityRadarChart 
          title="Executive's Productivity Score"
          subtitle="Performance comparison across key metrics"
          data={productivityData}
          executives={[executive.name, 'Team Average']}
        />
      </div>
    </div>
  );
};

export default ExecutiveDetails;
