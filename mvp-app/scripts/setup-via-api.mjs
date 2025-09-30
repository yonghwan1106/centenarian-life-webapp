// Setup checklist tables using Supabase Management API
import https from 'https'

const SUPABASE_PROJECT_ID = 'gqxpabnsdpnrztzpdudi'
const SUPABASE_ACCESS_TOKEN = 'sbp_a908c44758f006a3ea523d9532db565eb728ced7'

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

CREATE INDEX IF NOT EXISTS idx_checklist_entries_user_date ON public.daily_checklist_entries(user_id, checklist_date DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_user_date ON public.daily_reflections(user_id, reflection_date DESC);

ALTER TABLE public.daily_checklist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can insert own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can update own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can delete own checklist entries" ON public.daily_checklist_entries;
DROP POLICY IF EXISTS "Users can view own reflections" ON public.daily_reflections;
DROP POLICY IF EXISTS "Users can insert own reflections" ON public.daily_reflections;
DROP POLICY IF EXISTS "Users can update own reflections" ON public.daily_reflections;
DROP POLICY IF EXISTS "Users can delete own reflections" ON public.daily_reflections;

CREATE POLICY "Users can view own checklist entries" ON public.daily_checklist_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist entries" ON public.daily_checklist_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist entries" ON public.daily_checklist_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklist entries" ON public.daily_checklist_entries
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reflections" ON public.daily_reflections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections" ON public.daily_reflections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections" ON public.daily_reflections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections" ON public.daily_reflections
    FOR DELETE USING (auth.uid() = user_id);
`

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql })

    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${SUPABASE_PROJECT_ID}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = https.request(options, (res) => {
      let body = ''

      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(body)
            resolve(result)
          } catch (e) {
            resolve({ statusCode: res.statusCode, body })
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`))
        }
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    req.write(data)
    req.end()
  })
}

async function setupDatabase() {
  console.log('🔧 Setting up checklist tables via Supabase Management API...\n')

  try {
    console.log('📡 Executing SQL...')
    const result = await executeSQL(createTablesSQL)

    console.log('✅ SQL executed successfully!')
    console.log('Result:', JSON.stringify(result, null, 2))

    console.log('\n🎉 Database setup complete! Checklist tables are ready.\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('\n⚠️  Note: The Supabase Management API might not support direct SQL execution.')
    console.error('Please run the SQL manually in Supabase Dashboard:')
    console.error('1. Go to https://supabase.com/dashboard/project/gqxpabnsdpnrztzpdudi/sql')
    console.error('2. Copy the content from database/create_checklist_tables.sql')
    console.error('3. Paste and click "Run"\n')
    process.exit(1)
  }
}

setupDatabase()