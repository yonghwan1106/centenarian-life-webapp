const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gqxpabnsdpnrztzpdudi.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeHBhYm5zZHBucnp0enBkdWRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwODM0MCwiZXhwIjoyMDY2NDg0MzQwfQ.qcAUmET41RdLkzt9xS1-fxJm3l1GEfpTTgCPgHFFycQey'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTable() {
  console.log('Creating daily_wellness_checklists table...')
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.daily_wellness_checklists (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      checklist_date DATE NOT NULL,
      checklist_data JSONB NOT NULL,
      reflection_data JSONB,
      completion_percentage INTEGER DEFAULT 0,
      total_items INTEGER DEFAULT 0,
      completed_items INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, checklist_date)
    );

    CREATE INDEX IF NOT EXISTS idx_daily_wellness_checklists_user_date 
    ON public.daily_wellness_checklists(user_id, checklist_date DESC);

    ALTER TABLE public.daily_wellness_checklists ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own checklists" ON public.daily_wellness_checklists;
    DROP POLICY IF EXISTS "Users can insert own checklists" ON public.daily_wellness_checklists;
    DROP POLICY IF EXISTS "Users can update own checklists" ON public.daily_wellness_checklists;
    DROP POLICY IF EXISTS "Users can delete own checklists" ON public.daily_wellness_checklists;

    CREATE POLICY "Users can view own checklists" ON public.daily_wellness_checklists
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own checklists" ON public.daily_wellness_checklists
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own checklists" ON public.daily_wellness_checklists
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own checklists" ON public.daily_wellness_checklists
      FOR DELETE USING (auth.uid() = user_id);
  `

  try {
    // Direct SQL execution using the edge function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Success:', result)
  } catch (error) {
    console.error('Error creating table:', error)
    
    // Try alternative method - direct query
    try {
      console.log('Trying alternative method...')
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'daily_wellness_checklists')
        .limit(1)
      
      if (error) {
        console.log('Table does not exist, error:', error.message)
      } else {
        console.log('Table check result:', data)
      }
    } catch (altError) {
      console.error('Alternative method failed:', altError)
    }
  }
}

createTable()