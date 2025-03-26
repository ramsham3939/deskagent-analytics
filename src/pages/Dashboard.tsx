
import React from 'react';
import StatisticCard from '@/components/StatisticCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats, executives } from '@/utils/mockData';
import {
  Phone,
  Users,
  Timer,
  CheckCircle,
  BarChart2,
  TrendingUp,
  TrendingDown,
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
} from 'recharts';

const Dashboard = () => {
  // Prepare data for charts
  const callTrendData = dashboardStats.callsTrend.map((value, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    calls: value,
  }));

  const sentimentData = [
    { name: 'Positive', value: dashboardStats.sentimentDistribution.positive },
    { name: 'Neutral', value: dashboardStats.sentimentDistribution.neutral },
    { name: 'Negative', value: dashboardStats.sentimentDistribution.negative },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of call center performance and key metrics
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Calls"
          value={dashboardStats.totalCalls}
          icon={<Phone className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
          description="Total calls received to date"
        />
        <StatisticCard
          title="Calls Today"
          value={dashboardStats.callsToday}
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 5, isPositive: true }}
          description="Calls received today"
        />
        <StatisticCard
          title="Online Executives"
          value={`${dashboardStats.onlineExecutives}/${executives.length}`}
          icon={<Users className="h-4 w-4" />}
          description="Executives currently available"
        />
        <StatisticCard
          title="Avg. Handling Time"
          value={`${dashboardStats.averageHandlingTime.toFixed(1)}m`}
          icon={<Timer className="h-4 w-4" />}
          trend={{ value: 0.8, isPositive: false }}
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
                    dataKey="day" 
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
                    dataKey="calls"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorCalls)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                    dataKey="name" 
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
                    dataKey="value" 
                    animationDuration={1000}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={index === 0 ? '#4ade80' : index === 1 ? '#94a3b8' : '#f87171'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Resolved Calls"
          value={`${Math.round((dashboardStats.resolvedCalls / dashboardStats.totalCalls) * 100)}%`}
          icon={<CheckCircle className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
          description="Call resolution rate"
        />
        <StatisticCard
          title="Pending Calls"
          value={dashboardStats.pendingCalls}
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 2, isPositive: false }}
          description="Calls waiting to be resolved"
        />
        <StatisticCard
          title="Satisfaction Score"
          value={dashboardStats.satisfactionScore.toFixed(1)}
          icon={<BarChart2 className="h-4 w-4" />}
          trend={{ value: 0.2, isPositive: true }}
          description="Average customer satisfaction"
        />
        <StatisticCard
          title="Call Growth"
          value="12%"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 4, isPositive: true }}
          description="Growth compared to last month"
        />
      </div>
    </div>
  );
};

export default Dashboard;
