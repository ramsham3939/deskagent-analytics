
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
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define chart type options
const chartTypes = [
  { id: 'bar', name: 'Bar Chart' },
  { id: 'line', name: 'Line Chart' },
  { id: 'area', name: 'Area Chart' },
  { id: 'pie', name: 'Pie Chart' },
];

// Color schemes for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

const CustomChartBuilder = () => {
  const { toast } = useToast();
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available fields from database on component mount
  useEffect(() => {
    fetchAvailableFields();
  }, []);

  // Fetch available fields from database tables
  const fetchAvailableFields = async () => {
    try {
      setLoading(true);
      
      // Get fields from call_data table
      const { data: callDataFields, error: callDataError } = await supabase
        .from('call_data')
        .select('*')
        .limit(1);
      
      // Get fields from calls table
      const { data: callsFields, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .limit(1);
      
      // Get fields from user table
      const { data: userFields, error: userError } = await supabase
        .from('user')
        .select('*')
        .limit(1);
      
      if (callDataError || callsError || userError) {
        throw new Error('Error fetching schema information');
      }
      
      // Combine all available fields from the tables
      const fields: string[] = [];
      
      if (callDataFields && callDataFields.length > 0) {
        Object.keys(callDataFields[0]).forEach(key => {
          fields.push(`call_data.${key}`);
        });
      }
      
      if (callsFields && callsFields.length > 0) {
        Object.keys(callsFields[0]).forEach(key => {
          fields.push(`calls.${key}`);
        });
      }
      
      if (userFields && userFields.length > 0) {
        Object.keys(userFields[0]).forEach(key => {
          fields.push(`user.${key}`);
        });
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
  useEffect(() => {
    if (xAxis && yAxis) {
      generateChartData();
    }
  }, [xAxis, yAxis]);

  const generateChartData = async () => {
    try {
      setLoading(true);
      
      // Extract table and field names
      const [xTable, xField] = xAxis.split('.');
      const [yTable, yField] = yAxis.split('.');
      
      let data: any[] = [];
      
      // Simple case: x and y from the same table
      if (xTable === yTable) {
        const { data: tableData, error } = await supabase
          .from(xTable)
          .select(`${xField},${yField}`);
          
        if (error) throw error;
        
        data = tableData.map(item => ({
          name: item[xField]?.toString() || 'Unknown',
          value: typeof item[yField] === 'number' ? item[yField] : 0
        }));
      }
      // When fields are from different tables (simplified approach)
      else {
        // In a real app, you would need to handle joins properly
        // This is a simplified example
        const { data: xData, error: xError } = await supabase
          .from(xTable)
          .select(`id,${xField}`);
          
        const { data: yData, error: yError } = await supabase
          .from(yTable)
          .select(`id,${yField}`);
          
        if (xError || yError) throw new Error('Error fetching data');
        
        // Simplified merging of data - in a real app, this would need proper joining logic
        // This is just for demonstration purposes
        data = xData.slice(0, 5).map((xItem, index) => ({
          name: xItem[xField]?.toString() || 'Unknown',
          value: index < yData.length && typeof yData[index][yField] === 'number' 
            ? yData[index][yField] 
            : Math.floor(Math.random() * 100) // Fallback to random data for demo
        }));
      }
      
      // Sort data for better visualization
      data.sort((a, b) => b.value - a.value);
      
      // Limit to top 10 results for better visualization
      setChartData(data.slice(0, 10));
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

  // Render the appropriate chart based on the selected chart type
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Select X and Y axis fields to generate chart
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
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
                label={(entry) => entry.name}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Custom Chart Builder</CardTitle>
        <CardDescription>Create your own charts from database fields</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select
                value={chartType}
                onValueChange={setChartType}
              >
                <SelectTrigger id="chart-type">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="x-axis">X-Axis / Labels</Label>
              <Select
                value={xAxis}
                onValueChange={setXAxis}
              >
                <SelectTrigger id="x-axis">
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
              <Label htmlFor="y-axis">Y-Axis / Values</Label>
              <Select
                value={yAxis}
                onValueChange={setYAxis}
              >
                <SelectTrigger id="y-axis">
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
          </div>
          
          <div className="border rounded-md p-2 h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              renderChart()
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomChartBuilder;
