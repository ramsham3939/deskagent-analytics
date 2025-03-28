
import React, { useState, useEffect } from 'react';
import StatisticCard from '@/components/StatisticCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  Users,
  Timer,
  CheckCircle,
  BarChart2,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import CustomChartBuilder from '@/components/CustomChartBuilder';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DashboardStat {
  stat_name: string;
  stat_value: number;
  trend_value: number | null;
  trend_is_positive: boolean | null;
}

interface CallTrend {
  day_name: string;
  call_count: number;
}

interface SentimentDistribution {
  sentiment_type: string;
  percentage: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, DashboardStat>>({});
  const [callTrendData, setCallTrendData] = useState<CallTrend[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentDistribution[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const { data: statsData, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .order('stat_date', { ascending: false });
      
      if (statsError) throw statsError;
      
      // Transform stats data into a usable format
      const statsRecord: Record<string, DashboardStat> = {};
      statsData?.forEach(stat => {
        statsRecord[stat.stat_name] = stat;
      });
      
      // Fetch call trend data
      const { data: callTrends, error: callTrendsError } = await supabase
        .from('call_trends')
        .select('*')
        .order('id', { ascending: true });
      
      if (callTrendsError) throw callTrendsError;
      
      // Fetch sentiment distribution data
      const { data: sentiments, error: sentimentsError } = await supabase
        .from('sentiment_distribution')
        .select('*');
      
      if (sentimentsError) throw sentimentsError;
      
      setStats(statsRecord);
      setCallTrendData(callTrends || []);
      setSentimentData(sentiments || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatValue = (statName: string): number => {
    return stats[statName]?.stat_value || 0;
  };

  const getStatTrend = (statName: string): { value: number; isPositive: boolean } | undefined => {
    const stat = stats[statName];
    if (!stat) return undefined;
    
    if (stat.trend_value !== null && stat.trend_value !== undefined && 
        stat.trend_is_positive !== null && stat.trend_is_positive !== undefined) {
      return {
        value: stat.trend_value,
        isPositive: stat.trend_is_positive
      };
    }
    return undefined;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of call center performance and key metrics
        </p>
      </div>

      {/* Custom Chart Builder */}
      <CustomChartBuilder />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Calls"
          value={getStatValue('total_calls')}
          icon={<Phone className="h-4 w-4" />}
          trend={getStatTrend('total_calls')}
          description="Total calls received to date"
        />
        <StatisticCard
          title="Calls Today"
          value={getStatValue('calls_today')}
          icon={<Clock className="h-4 w-4" />}
          trend={getStatTrend('calls_today')}
          description="Calls received today"
        />
        <StatisticCard
          title="Online Executives"
          value={`${getStatValue('online_executives')}/${getStatValue('total_executives')}`}
          icon={<Users className="h-4 w-4" />}
          description="Executives currently available"
        />
        <StatisticCard
          title="Avg. Handling Time"
          value={`${getStatValue('average_handling_time').toFixed(1)}m`}
          icon={<Timer className="h-4 w-4" />}
          trend={getStatTrend('average_handling_time')}
          description="Average time per call"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
            <CardDescription>Daily call volume for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={callTrendData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day_name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                              <p className="font-medium">{`${label}`}</p>
                              <p className="text-primary">{`Calls: ${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="call_count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorCalls)"
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Distribution of customer sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sentimentData}
                    margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="sentiment_type" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      width={80}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                              <p className="font-medium">{`${label} Sentiment`}</p>
                              <p className="text-primary">{`${payload[0].value}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="percentage" 
                      animationDuration={1000}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={
                            entry.sentiment_type === 'positive' 
                              ? '#4ade80' 
                              : entry.sentiment_type === 'neutral' 
                                ? '#94a3b8' 
                                : '#f87171'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Resolved Calls"
          value={`${getStatValue('resolved_calls')}%`}
          icon={<CheckCircle className="h-4 w-4" />}
          trend={getStatTrend('resolved_calls')}
          description="Call resolution rate"
        />
        <StatisticCard
          title="Pending Calls"
          value={getStatValue('pending_calls')}
          icon={<Clock className="h-4 w-4" />}
          trend={getStatTrend('pending_calls')}
          description="Calls waiting to be resolved"
        />
        <StatisticCard
          title="Satisfaction Score"
          value={getStatValue('satisfaction_score').toFixed(1)}
          icon={<BarChart2 className="h-4 w-4" />}
          trend={getStatTrend('satisfaction_score')}
          description="Average customer satisfaction"
        />
        <StatisticCard
          title="Call Growth"
          value={`${getStatValue('call_growth')}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={getStatTrend('call_growth')}
          description="Growth compared to last month"
        />
      </div>
    </div>
  );
};

export default Dashboard;
