
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import {
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { RefreshCw, Download, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Activity } from 'lucide-react';

// Define chart type options
const chartTypes = [
  { id: 'bar', name: 'Bar Chart', icon: <BarChart2 className="h-4 w-4" /> },
  { id: 'line', name: 'Line Chart', icon: <LineChartIcon className="h-4 w-4" /> },
  { id: 'area', name: 'Area Chart', icon: <Activity className="h-4 w-4" /> },
  { id: 'pie', name: 'Pie Chart', icon: <PieChartIcon className="h-4 w-4" /> },
];

// Color schemes for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

interface ChartData {
  id: number;
  category: string;
  value: number;
  label: string;
  chart_type: string;
  created_at?: string;
}

interface DataItem {
  name: string;
  value: number;
}

const CustomChartBuilder = () => {
  const { toast } = useToast();
  const [chartType, setChartType] = useState('bar');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [chartData, setChartData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string>('');

  // Fetch available labels and categories from database on component mount
  useEffect(() => {
    fetchAvailableOptions();
  }, []);

  // Fetch unique labels and categories from the chart_data table
  const fetchAvailableOptions = async () => {
    try {
      setLoading(true);
      
      // Fetch all chart data to extract unique labels and categories
      const { data, error } = await supabase
        .from('chart_data')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Extract unique labels and categories
        const labels = [...new Set(data.map(item => item.label))];
        const categories = [...new Set(data.map(item => item.category))];
        
        setAvailableLabels(labels);
        setAvailableCategories(categories);
      }
      
    } catch (error) {
      console.error('Error fetching available options:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available chart options",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data based on selected label and category
  const generateChartData = async () => {
    if (!selectedLabel || !selectedCategory) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('chart_data')
        .select('*');
      
      if (selectedLabel) {
        query = query.eq('label', selectedLabel);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Filter and format data for the chart
        const formattedData: DataItem[] = data
          .filter(item => item.chart_type === chartType || item.chart_type === 'all')
          .map(item => ({
            name: item.category,
            value: item.value
          }));
        
        // Sort data for better visualization
        formattedData.sort((a, b) => b.value - a.value);
        
        // Generate insights based on data
        generateInsights(formattedData, selectedLabel);
        
        setChartData(formattedData);
      } else {
        setChartData([]);
        setInsight('No data available for the selected criteria.');
      }
      
    } catch (error) {
      console.error('Error generating chart data:', error);
      toast({
        title: "Error",
        description: "Failed to generate chart data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate insights based on chart data
  const generateInsights = (data: DataItem[], label: string) => {
    if (!data || data.length === 0) {
      setInsight('No data available for insights.');
      return;
    }
    
    // Find highest and lowest values
    const highest = [...data].sort((a, b) => b.value - a.value)[0];
    const lowest = [...data].sort((a, b) => a.value - b.value)[0];
    
    // Calculate average
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const average = sum / data.length;
    
    // Count values above average
    const aboveAverage = data.filter(item => item.value > average).length;
    
    // Generate insight text
    const insightText = `
      <span class="font-bold">Key Insights for ${label}:</span>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>Highest value: ${highest.name} (${highest.value})</li>
        <li>Lowest value: ${lowest.name} (${lowest.value})</li>
        <li>Average value: ${average.toFixed(2)}</li>
        <li>${aboveAverage} out of ${data.length} categories are above average</li>
        <li>Data range: ${lowest.value} to ${highest.value}</li>
        <li>Total sum: ${sum}</li>
      </ul>
    `;
    
    setInsight(insightText);
  };

  // Refresh data
  const handleRefresh = () => {
    if (selectedLabel && selectedCategory) {
      generateChartData();
      toast({
        title: "Refreshed",
        description: "Chart data has been refreshed",
      });
    }
  };

  // Download chart as image (placeholder function)
  const handleDownload = () => {
    toast({
      title: "Download initiated",
      description: "Chart download functionality would go here",
    });
  };

  // Update chart data when selections change
  useEffect(() => {
    if (selectedLabel && selectedCategory) {
      generateChartData();
    }
  }, [selectedLabel, selectedCategory, chartType]);

  // Render the appropriate chart based on the selected chart type
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <BarChart2 className="h-12 w-12 mb-4 opacity-20" />
          <p>Select label and category to generate chart</p>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">{`Value: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">{`Value: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4, fill: 'white' }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">{`Value: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                        <p className="font-medium">{payload[0].name}</p>
                        <p className="text-primary">{`Value: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Custom Chart Builder</CardTitle>
            <CardDescription>Create insights from your data</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading || !selectedLabel || !selectedCategory}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={chartData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ResizablePanelGroup direction="vertical" className="min-h-[600px]">
          <ResizablePanel defaultSize={25}>
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="chart-type" className="text-sm font-medium">Chart Type</Label>
                  <Select
                    value={chartType}
                    onValueChange={setChartType}
                  >
                    <SelectTrigger id="chart-type" className="w-full">
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id} className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            {type.icon}
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="label" className="text-sm font-medium">Data Series</Label>
                  <Select
                    value={selectedLabel}
                    onValueChange={setSelectedLabel}
                  >
                    <SelectTrigger id="label" className="w-full">
                      <SelectValue placeholder="Select data series" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLabels.map((label) => (
                        <SelectItem key={label} value={label}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={generateChartData} 
                    disabled={!selectedLabel || !selectedCategory || loading}
                    className="w-full"
                  >
                    {loading ? 'Loading...' : 'Generate Chart'}
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 h-full">
              <div className="lg:col-span-2 border rounded-xl overflow-hidden bg-card p-4 h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4 px-2">
                  {selectedLabel ? 
                    `${selectedLabel} by ${selectedCategory}` : 
                    'Chart Preview'}
                </h3>
                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    renderChart()
                  )}
                </div>
              </div>
              
              <div className="border rounded-xl p-4 bg-card">
                <h3 className="text-lg font-medium mb-4">Insights</h3>
                <div className="prose prose-sm max-w-none">
                  {insight ? (
                    <div dangerouslySetInnerHTML={{ __html: insight }} />
                  ) : (
                    <div className="text-muted-foreground">
                      Generate a chart to see insights about your data.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};

export default CustomChartBuilder;
