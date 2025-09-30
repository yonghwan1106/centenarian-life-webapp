// Setup checklist tables using direct PostgreSQL connection
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { Client } = pg

const connectionString = 'postgresql://postgres:22qjsrlf67!@db.gqxpabnsdpnrztzpdudi.supabase.co:5432/postgres'

async function setupDatabase() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🔗 Connecting to Supabase...')
    await client.connect()
    console.log('✅ Connected!\n')

    // Check if tables exist
    console.log('1️⃣ Checking if checklist tables exist...')
    const checkTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('daily_checklist_entries', 'daily_reflections')
    `
    const { rows: existingTables } = await client.query(checkTablesQuery)
    console.log('Existing tables:', existingTables.map(t => t.table_name).join(', ') || 'None')

    if (existingTables.length === 2) {
      console.log('✅ Both tables already exist!\n')
    } else {
      console.log('\n2️⃣ Creating checklist tables...')

      const createTablesSQL = `
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
      `

      await client.query(createTablesSQL)
      console.log('✅ Tables created successfully!\n')
    }

    // Setup RLS policies
    console.log('3️⃣ Setting up Row Level Security (RLS)...')
    const rlsSQL = `
-- Enable RLS
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

    await client.query(rlsSQL)
    console.log('✅ RLS policies created successfully!\n')

    // Verify tables
    console.log('4️⃣ Verifying setup...')
    const verifyQuery = `
      SELECT
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN ('daily_checklist_entries', 'daily_reflections')
    `
    const { rows: verification } = await client.query(verifyQuery)
    console.log('Tables and RLS status:')
    verification.forEach(row => {
      console.log(`  - ${row.tablename}: RLS ${row.rowsecurity ? '✅ ENABLED' : '❌ DISABLED'}`)
    })

    // Check policies
    const policiesQuery = `
      SELECT
        tablename,
        policyname,
        cmd
      FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename IN ('daily_checklist_entries', 'daily_reflections')
      ORDER BY tablename, policyname
    `
    const { rows: policies } = await client.query(policiesQuery)
    console.log(`\n📋 Total policies created: ${policies.length}`)

    console.log('\n🎉 Database setup complete! All checklist tables are ready.\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('🔌 Database connection closed.')
  }
}

setupDatabase()