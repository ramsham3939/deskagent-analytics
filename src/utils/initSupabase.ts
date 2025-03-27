
import { supabase } from "@/integrations/supabase/client";

export async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    
    // Check if we need to initialize chart data
    const { data: chartData } = await supabase
      .from('chart_data')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    if (!chartData) {
      console.log("Initializing chart data...");
      
      // Invoke the function to initialize chart data
      const { data, error } = await supabase.functions.invoke('initialize-chart-data');
      
      if (error) {
        console.error("Error initializing chart data:", error);
      } else {
        console.log("Chart data initialization response:", data);
      }
    } else {
      console.log("Chart data already initialized.");
    }
    
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
