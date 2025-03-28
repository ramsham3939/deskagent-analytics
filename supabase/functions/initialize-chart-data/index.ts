
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Checking if chart_data table exists...')
    
    // Create the required stored procedures for type-safe access
    // First create a function to check if chart_data exists
    await supabase.rpc('exec', { 
      query: `
        CREATE OR REPLACE FUNCTION public.check_chart_data_exists()
        RETURNS boolean
        LANGUAGE plpgsql
        AS $$
        DECLARE
          table_exists boolean;
          row_exists boolean;
        BEGIN
          -- Check if the table exists
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'chart_data'
          ) INTO table_exists;
          
          IF NOT table_exists THEN
            RETURN false;
          END IF;
          
          -- Check if any rows exist
          SELECT EXISTS (SELECT 1 FROM public.chart_data LIMIT 1) INTO row_exists;
          RETURN row_exists;
        END;
        $$;
        
        -- Create function to get unique labels
        CREATE OR REPLACE FUNCTION public.get_chart_data_labels()
        RETURNS SETOF text
        LANGUAGE sql
        AS $$
          SELECT DISTINCT label FROM public.chart_data ORDER BY label;
        $$;
        
        -- Create function to get unique categories
        CREATE OR REPLACE FUNCTION public.get_chart_data_categories()
        RETURNS SETOF text
        LANGUAGE sql
        AS $$
          SELECT DISTINCT category FROM public.chart_data ORDER BY category;
        $$;
        
        -- Create function to get data filtered by label
        CREATE OR REPLACE FUNCTION public.get_chart_data_by_label(label_filter text)
        RETURNS SETOF public.chart_data
        LANGUAGE sql
        AS $$
          SELECT * FROM public.chart_data 
          WHERE label = label_filter 
          ORDER BY category;
        $$;
      `
    });
    
    // Check if the chart_data table exists
    const { data: tableExists, error: tableError } = await supabase.rpc('check_chart_data_exists');
    
    if (tableError) {
      console.error('Error checking if chart_data exists:', tableError);
      
      // Create the chart_data table if it doesn't exist
      await supabase.rpc('exec', { 
        query: `
          CREATE TABLE IF NOT EXISTS public.chart_data (
            id SERIAL PRIMARY KEY,
            label TEXT NOT NULL,
            category TEXT NOT NULL,
            value NUMERIC NOT NULL,
            chart_type TEXT DEFAULT 'all',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE public.chart_data ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow read access for all users" 
            ON public.chart_data 
            FOR SELECT 
            USING (true);
        `
      });
    }
    
    // Check if data already exists
    const { data: dataExists, error: dataError } = await supabase.rpc('check_chart_data_exists');
    
    if (dataError) {
      throw dataError;
    }
    
    // Only populate if no data exists
    if (!dataExists) {
      console.log('Populating chart_data table with sample data...');
      
      // Sample chart data categories
      const categories = [
        'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      // Sample chart data metrics
      const labels = [
        'Revenue', 'Calls', 'Resolution Rate', 'Customer Satisfaction', 
        'Call Duration', 'Agent Performance'
      ];
      
      // Generate sample data
      const sampleData = [];
      
      for (const label of labels) {
        for (const category of categories) {
          // Generate random value based on the label
          let value = 0;
          let chartType = 'all';
          
          switch (label) {
            case 'Revenue':
              value = Math.floor(Math.random() * 10000) + 5000;
              break;
            case 'Calls':
              value = Math.floor(Math.random() * 500) + 100;
              break;
            case 'Resolution Rate':
              value = Math.floor(Math.random() * 30) + 70;
              break;
            case 'Customer Satisfaction':
              value = Math.floor(Math.random() * 2) + 3;
              break;
            case 'Call Duration':
              value = Math.floor(Math.random() * 10) + 2;
              break;
            case 'Agent Performance':
              value = Math.floor(Math.random() * 20) + 80;
              break;
            default:
              value = Math.floor(Math.random() * 100);
          }
          
          sampleData.push({
            label,
            category,
            value,
            chart_type: chartType
          });
        }
      }
      
      // Batch insert data into chart_data table
      const batchSize = 50;
      let insertedCount = 0;
      
      for (let i = 0; i < sampleData.length; i += batchSize) {
        const batch = sampleData.slice(i, i + batchSize);
        
        // Use the REST API directly instead of the typed client
        const response = await fetch(`${supabaseUrl}/rest/v1/chart_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(batch)
        });
        
        if (!response.ok) {
          console.error('Error inserting batch:', await response.text());
        } else {
          insertedCount += batch.length;
          console.log(`Inserted ${insertedCount} of ${sampleData.length} records...`);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Created and populated chart_data table with ${insertedCount} records` 
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Chart data already exists' 
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      );
    }
    
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
