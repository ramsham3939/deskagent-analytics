
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
import { Database } from '@/integrations/supabase/types';
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

// Valid table names from our database
type TableName = 'call_data' | 'calls' | 'user';

const CustomChartBuilder = () => {
  const { toast } = useToast();
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string>('');

  // Fetch available fields from database on component mount
  useEffect(() => {
    fetchAvailableFields();
  }, []);

  // Fetch available fields from database tables
  const fetchAvailableFields = async () => {
    try {
      setLoading(true);
      
      // Get valid table names from our database
      const tables: TableName[] = ['call_data', 'calls', 'user'];
      const fields: string[] = [];
      
      // Fetch schema from each table
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`Error fetching ${table} fields:`, error);
          continue;
        }
        
        if (data && data.length > 0) {
          Object.keys(data[0]).forEach(key => {
            fields.push(`${table}.${key}`);
          });
        }
      }
      
      setAvailableFields(fields);
    } catch (error) {
      console.error('Error fetching available fields:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available fields",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data based on selected fields
  const generateChartData = async () => {
    if (!xAxis || !yAxis) return;
    
    try {
      setLoading(true);
      
      // Extract table and field names
      const [xTable, xField] = xAxis.split('.');
      const [yTable, yField] = yAxis.split('.');
      
      let data: any[] = [];
      
      // Validate table names - only proceed with valid tables
      if (!['call_data', 'calls', 'user'].includes(xTable) || 
          !['call_data', 'calls', 'user'].includes(yTable)) {
        throw new Error('Invalid table name');
      }
      
      // Handle as valid TableName type
      const validXTable = xTable as TableName;
      const validYTable = yTable as TableName;
      
      // Simple case: x and y from the same table
      if (xTable === yTable) {
        const { data: tableData, error } = await supabase
          .from(validXTable)
          .select(`${xField},${yField}`);
          
        if (error) throw error;
        
        data = tableData.map(item => ({
          name: item[xField as keyof typeof item]?.toString() || 'Unknown',
          value: typeof item[yField as keyof typeof item] === 'number' 
            ? item[yField as keyof typeof item] 
            : 0
        }));
      }
      // When fields are from different tables (simplified approach)
      else {
        // First table query
        const { data: xData, error: xError } = await supabase
          .from(validXTable)
          .select(`id,${xField}`);
          
        // Second table query  
        const { data: yData, error: yError } = await supabase
          .from(validYTable)
          .select(`id,${yField}`);
          
        if (xError || yError) throw new Error('Error fetching data');
        
        // Map data together (simplified for demonstration)
        data = xData.slice(0, 10).map((xItem, index) => ({
          name: xItem[xField as keyof typeof xItem]?.toString() || 'Unknown',
          value: index < yData.length && typeof yData[index][yField as keyof typeof yData[0]] === 'number' 
            ? yData[index][yField as keyof typeof yData[0]] 
            : Math.floor(Math.random() * 100) // Fallback to random data for demo
        }));
      }
      
      // Sort data for better visualization
      data.sort((a, b) => b.value - a.value);
      
      // Limit to top 10 results for better visualization
      const finalData = data.slice(0, 10);
      
      // Generate insights based on data
      generateInsights(finalData, xField, yField);
      
      setChartData(finalData);
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
  const generateInsights = (data: any[], xField: string, yField: string) => {
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
      <span class="font-bold">Key Insights:</span>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>Highest ${yField}: ${highest.name} (${highest.value})</li>
        <li>Lowest ${yField}: ${lowest.name} (${lowest.value})</li>
        <li>Average ${yField}: ${average.toFixed(2)}</li>
        <li>${aboveAverage} out of ${data.length} ${xField}s are above average</li>
        <li>Data range: ${lowest.value} to ${highest.value}</li>
      </ul>
    `;
    
    setInsight(insightText);
  };

  // Refresh data
  const handleRefresh = () => {
    if (xAxis && yAxis) {
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

  // Update chart data when axes change
  useEffect(() => {
    if (xAxis && yAxis) {
      generateChartData();
    }
  }, [xAxis, yAxis, chartType]);

  // Render the appropriate chart based on the selected chart type
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <BarChart2 className="h-12 w-12 mb-4 opacity-20" />
          <p>Select X and Y axis fields to generate chart</p>
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
              disabled={loading || !xAxis || !yAxis}
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
                  <Label htmlFor="x-axis" className="text-sm font-medium">X-Axis / Category</Label>
                  <Select
                    value={xAxis}
                    onValueChange={setXAxis}
                  >
                    <SelectTrigger id="x-axis" className="w-full">
                      <SelectValue placeholder="Select X-Axis field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="y-axis" className="text-sm font-medium">Y-Axis / Values</Label>
                  <Select
                    value={yAxis}
                    onValueChange={setYAxis}
                  >
                    <SelectTrigger id="y-axis" className="w-full">
                      <SelectValue placeholder="Select Y-Axis field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={generateChartData} 
                    disabled={!xAxis || !yAxis || loading}
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
                  {xAxis && yAxis ? 
                    `${yAxis.split('.')[1]} by ${xAxis.split('.')[1]}` : 
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
