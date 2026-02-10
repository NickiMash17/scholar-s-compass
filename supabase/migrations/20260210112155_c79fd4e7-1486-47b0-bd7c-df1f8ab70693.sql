
-- Profiles table for user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Study data table - stores the full study profile as JSONB
CREATE TABLE public.study_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  study_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.study_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study data" ON public.study_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study data" ON public.study_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study data" ON public.study_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study data" ON public.study_data FOR DELETE USING (auth.uid() = user_id);

-- Gamification data table
CREATE TABLE public.gamification_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  activity_log JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gamification_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification" ON public.gamification_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gamification" ON public.gamification_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gamification" ON public.gamification_data FOR UPDATE USING (auth.uid() = user_id);

-- Pomodoro data table
CREATE TABLE public.pomodoro_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{"workDuration": 25, "breakDuration": 5, "soundEnabled": true}'::jsonb,
  stats JSONB NOT NULL DEFAULT '{"totalSessions": 0, "totalFocusMinutes": 0, "sessionsPerDay": {}}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pomodoro_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pomodoro" ON public.pomodoro_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pomodoro" ON public.pomodoro_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pomodoro" ON public.pomodoro_data FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.gamification_data (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.pomodoro_data (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_study_data_updated_at BEFORE UPDATE ON public.study_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gamification_updated_at BEFORE UPDATE ON public.gamification_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pomodoro_updated_at BEFORE UPDATE ON public.pomodoro_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
