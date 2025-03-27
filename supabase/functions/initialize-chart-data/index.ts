
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
    
    // Check if the chart_data table exists
    const { data: existingTables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'chart_data')
    
    if (tableError) {
      throw tableError
    }
    
    // If the table doesn't exist, create it
    if (!existingTables || existingTables.length === 0) {
      console.log('Creating chart_data table...')
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
      })
    }
    
    // Check if data already exists
    const { data: existingData, error: dataError } = await supabase
      .from('chart_data')
      .select('id')
      .limit(1)
    
    if (dataError) {
      throw dataError
    }
    
    // Only populate if no data exists
    if (!existingData || existingData.length === 0) {
      console.log('Populating chart_data table with sample data...')
      
      // Sample chart data categories
      const categories = [
        'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
      
      // Sample chart data metrics
      const labels = [
        'Revenue', 'Calls', 'Resolution Rate', 'Customer Satisfaction', 
        'Call Duration', 'Agent Performance'
      ]
      
      // Generate sample data
      const sampleData = []
      
      for (const label of labels) {
        for (const category of categories) {
          // Generate random value based on the label
          let value = 0
          let chartType = 'all'
          
          switch (label) {
            case 'Revenue':
              value = Math.floor(Math.random() * 10000) + 5000
              break
            case 'Calls':
              value = Math.floor(Math.random() * 500) + 100
              break
            case 'Resolution Rate':
              value = Math.floor(Math.random() * 30) + 70
              break
            case 'Customer Satisfaction':
              value = Math.floor(Math.random() * 2) + 3
              break
            case 'Call Duration':
              value = Math.floor(Math.random() * 10) + 2
              break
            case 'Agent Performance':
              value = Math.floor(Math.random() * 20) + 80
              break
            default:
              value = Math.floor(Math.random() * 100)
          }
          
          sampleData.push({
            label,
            category,
            value,
            chart_type: chartType
          })
        }
      }
      
      // Batch insert data into chart_data table
      const batchSize = 50
      let insertedCount = 0
      
      for (let i = 0; i < sampleData.length; i += batchSize) {
        const batch = sampleData.slice(i, i + batchSize)
        
        const { error } = await supabase
          .from('chart_data')
          .insert(batch)
        
        if (error) {
          console.error('Error inserting batch:', error)
        } else {
          insertedCount += batch.length
          console.log(`Inserted ${insertedCount} of ${sampleData.length} records...`)
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
      )
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
      )
    }
    
  } catch (error) {
    console.error('Error:', error)
    
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
    )
  }
})
