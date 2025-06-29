-- Daily wellness checklist table
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

-- Index for daily checklist queries
CREATE INDEX IF NOT EXISTS idx_daily_wellness_checklists_user_date ON public.daily_wellness_checklists(user_id, checklist_date DESC);

-- Enable RLS for daily wellness checklists
ALTER TABLE public.daily_wellness_checklists ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily wellness checklists
CREATE POLICY IF NOT EXISTS "Users can view own checklists" ON public.daily_wellness_checklists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own checklists" ON public.daily_wellness_checklists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own checklists" ON public.daily_wellness_checklists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own checklists" ON public.daily_wellness_checklists
    FOR DELETE USING (auth.uid() = user_id);