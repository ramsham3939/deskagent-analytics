
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzuloriouwirmaxateto.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dWxvcmlvdXdpcm1heGF0ZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1ODU5OTUsImV4cCI6MjA1ODE2MTk5NX0._hLpk3HrvT4X5h2mzZ5XHfhzQFFOndLA_Zl0RFfuybg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to get chart data
export async function getChartData() {
  // Check if chart data exists
  const { data: chartData, error } = await supabase
    .from('call_trends')
    .select('*');

  if (error) {
    console.error('Error checking chart data:', error);
    return null;
  }

  return chartData;
}

// Helper function to get metrics data (for dashboard)
export async function getDashboardMetrics() {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*');
  
  if (error) {
    console.error('Error fetching dashboard metrics:', error);
    return null;
  }
  
  return data;
}

// Helper function to get executive performance data
export async function getExecutivePerformance() {
  const { data, error } = await supabase
    .from('executive_performance')
    .select('*');
  
  if (error) {
    console.error('Error fetching executive performance:', error);
    return null;
  }
  
  return data;
}

// Helper function to get sentiment distribution data
export async function getSentimentDistribution() {
  const { data, error } = await supabase
    .from('sentiment_distribution')
    .select('*');
  
  if (error) {
    console.error('Error fetching sentiment distribution:', error);
    return null;
  }
  
  return data;
}
