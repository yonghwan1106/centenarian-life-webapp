-- This SQL script creates the checklist tables in Supabase
-- Run this in your Supabase SQL Editor if the tables don't exist

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

-- Apply updated_at triggers to new tables
CREATE TRIGGER handle_checklist_entries_updated_at
    BEFORE UPDATE ON public.daily_checklist_entries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_reflections_updated_at
    BEFORE UPDATE ON public.daily_reflections
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS policies for checklist tables
ALTER TABLE public.daily_checklist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;

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