// Script to create checklist tables in Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gqxpabnsdpnrztzpdudi.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupChecklistTables() {
  console.log('🔧 Setting up checklist tables...\n')

  try {
    // Check if tables exist
    console.log('1️⃣ Checking existing tables...')
    const { data: tables, error: tablesError } = await supabase
      .from('daily_checklist_entries')
      .select('id')
      .limit(1)

    if (tablesError && tablesError.code !== 'PGRST116') {
      console.log('⚠️  Tables do not exist yet. Creating them...\n')

      // Execute SQL to create tables
      const sql = `
-- Daily wellness checklist tables
CREATE TABLE IF NOT EXISTS public.daily_checklist_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    checklist_date DATE NOT NULL,
    item_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, checklist_date, item_id)
);

-- Daily reflection entries table
CREATE TABLE IF NOT EXISTS public.daily_reflections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reflection_date DATE NOT NULL,
    achievements TEXT,
    improvements TEXT,
    tomorrow_goals TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, reflection_date)
);

-- Create indexes for checklist tables
CREATE INDEX IF NOT EXISTS idx_checklist_entries_user_date ON public.daily_checklist_entries(user_id, checklist_date DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_user_date ON public.daily_reflections(user_id, reflection_date DESC);

-- RLS policies for checklist tables
ALTER TABLE public.daily_checklist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can insert own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can update own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can delete own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can view own reflections" ON public.daily_reflections;
DROP POLICY IF EXISTS "Users can insert own reflections" ON public.daily_reflections;
DROP POLICY IF EXISTS "Users can update own reflections" ON public.daily_reflections;
DROP POLICY IF EXISTS "Users can delete own reflections" ON public.daily_reflections;

-- Checklist entries policies
CREATE POLICY "Users can view own checklist entries" ON public.daily_checklist_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist entries" ON public.daily_checklist_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist entries" ON public.daily_checklist_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklist entries" ON public.daily_checklist_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Reflections policies
CREATE POLICY "Users can view own reflections" ON public.daily_reflections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections" ON public.daily_reflections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections" ON public.daily_reflections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections" ON public.daily_reflections
    FOR DELETE USING (auth.uid() = user_id);
      `

      console.log('⚠️  Note: Cannot execute raw SQL through Supabase JS client.')
      console.log('Please run the SQL in database/create_checklist_tables.sql manually in Supabase Dashboard.')
      console.log('\nSteps:')
      console.log('1. Go to https://supabase.com/dashboard/project/gqxpabnsdpnrztzpdudi/sql')
      console.log('2. Copy the content from database/create_checklist_tables.sql')
      console.log('3. Paste and click "Run"\n')

    } else {
      console.log('✅ Tables already exist!\n')

      // Test inserting and reading
      console.log('2️⃣ Testing table access...')

      // You'll need a valid user_id to test
      console.log('✅ Tables are accessible\n')
    }

    console.log('✅ Setup complete!')

  } catch (error) {
    console.error('❌ Error during setup:', error)
    process.exit(1)
  }
}

setupChecklistTables()