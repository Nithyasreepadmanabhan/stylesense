-- ============================================
-- STYLESENSE DATABASE SCHEMA FOR SUPABASE
-- ============================================
-- Run these SQL queries in Supabase SQL Editor
-- Path: Supabase Dashboard → SQL Editor → Run Query

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- AUTHENTICATION & USER PROFILES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- STYLE PREFERENCES
-- ============================================

CREATE TABLE IF NOT EXISTS public.style_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  style VARCHAR(50) DEFAULT 'Casual',
  favorite_color VARCHAR(50) DEFAULT 'Blue',
  preferred_fit VARCHAR(50) DEFAULT 'Regular',
  preferred_occasion VARCHAR(50) DEFAULT 'Casual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.style_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own style preferences" ON public.style_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own style preferences" ON public.style_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- WARDROBE ITEMS
-- ============================================

CREATE TABLE IF NOT EXISTS public.wardrobe_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  color VARCHAR(50),
  pattern VARCHAR(50) DEFAULT 'Solid',
  season VARCHAR(50) DEFAULT 'Normal',
  occasion VARCHAR(50) DEFAULT 'Casual',
  style VARCHAR(50) DEFAULT 'Casual',
  brand VARCHAR(100),
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wardrobe" ON public.wardrobe_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create wardrobe items" ON public.wardrobe_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobe" ON public.wardrobe_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobe" ON public.wardrobe_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SAVED OUTFITS
-- ============================================

CREATE TABLE IF NOT EXISTS public.saved_outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255),
  occasion VARCHAR(50),
  style VARCHAR(50),
  score INTEGER DEFAULT 85,
  top_id UUID REFERENCES public.wardrobe_items(id) ON DELETE SET NULL,
  bottom_id UUID REFERENCES public.wardrobe_items(id) ON DELETE SET NULL,
  shoes_id UUID REFERENCES public.wardrobe_items(id) ON DELETE SET NULL,
  accessory_id UUID REFERENCES public.wardrobe_items(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.saved_outfits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own outfits" ON public.saved_outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create outfits" ON public.saved_outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits" ON public.saved_outfits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits" ON public.saved_outfits
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- STYLE QUIZ RESULTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.style_quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answer1 VARCHAR(255),
  answer2 VARCHAR(255),
  answer3 VARCHAR(255),
  answer4 VARCHAR(255),
  answer5 VARCHAR(255),
  result_style VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.style_quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz results" ON public.style_quiz_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create quiz results" ON public.style_quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DESIGNER PROFILES
-- ============================================

CREATE TABLE IF NOT EXISTS public.designer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand_name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  approval_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.designer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved designers" ON public.designer_profiles
  FOR SELECT USING (approval_status = 'approved');

-- ============================================
-- DIGITAL DESIGNS (Designer Studio)
-- ============================================

CREATE TABLE IF NOT EXISTS public.digital_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  designer_id UUID REFERENCES public.designer_profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.digital_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Designers can read own designs" ON public.digital_designs
  FOR SELECT USING (EXISTS(
    SELECT 1 FROM public.designer_profiles
    WHERE id = designer_id AND user_id = auth.uid()
  ));

-- ============================================
-- MODERATION REPORTS & ADMIN
-- ============================================

CREATE TABLE IF NOT EXISTS public.moderation_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content_type VARCHAR(50),
  content_id UUID,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;

-- Only admins can read/update moderation reports
CREATE POLICY "Only service role can access reports" ON public.moderation_reports
  USING (auth.role() = 'service_role');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_wardrobe_user_id ON public.wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_category ON public.wardrobe_items(category);
CREATE INDEX idx_outfits_user_id ON public.saved_outfits(user_id);
CREATE INDEX idx_style_pref_user_id ON public.style_preferences(user_id);
CREATE INDEX idx_designs_status ON public.digital_designs(status);
CREATE INDEX idx_moderation_status ON public.moderation_reports(status);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_style_preferences_updated_at BEFORE UPDATE ON public.style_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wardrobe_updated_at BEFORE UPDATE ON public.wardrobe_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outfits_updated_at BEFORE UPDATE ON public.saved_outfits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Database schema is now ready for Supabase!
-- Tables are secured with Row Level Security (RLS)
-- Each user can only access their own data
