-- =====================================================================
-- StyleSense — Production PostgreSQL Schema, Storage & RLS Policies
-- Database Engine: Supabase PostgreSQL
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'designer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Style Preferences (Style DNA)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    favorite_colors TEXT[] DEFAULT '{}',
    preferred_styles TEXT[] DEFAULT '{}',
    preferred_occasions TEXT[] DEFAULT '{}',
    preferred_brands TEXT[] DEFAULT '{}',
    preferred_price_range JSONB DEFAULT '{"min": 0, "max": 1000}',
    preferred_fit TEXT DEFAULT 'Regular',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('clothing', 'footwear', 'accessory', 'general')),
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Wardrobe Items Table
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory TEXT,
    brand TEXT,
    color TEXT NOT NULL,
    secondary_color TEXT,
    material TEXT,
    pattern TEXT DEFAULT 'Solid',
    style TEXT DEFAULT 'Casual',
    season TEXT DEFAULT 'All Season',
    occasion TEXT DEFAULT 'Casual',
    size TEXT,
    purchase_price NUMERIC(10,2),
    purchase_date DATE,
    image_url TEXT NOT NULL,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Outfits Table
CREATE TABLE IF NOT EXISTS public.outfits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    occasion TEXT,
    style TEXT,
    season TEXT,
    color_palette TEXT[] DEFAULT '{}',
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Outfit Items Mapping Table
CREATE TABLE IF NOT EXISTS public.outfit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outfit_id UUID REFERENCES public.outfits(id) ON DELETE CASCADE,
    wardrobe_item_id UUID REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
    position JSONB DEFAULT '{"x": 0, "y": 0, "scale": 1, "rotation": 0, "zIndex": 1}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Designer Profiles Table
CREATE TABLE IF NOT EXISTS public.designers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    bio TEXT,
    logo_url TEXT,
    cover_url TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    website_url TEXT,
    instagram_handle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    season TEXT,
    year INT DEFAULT 2026,
    theme TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Digital Designs Table
CREATE TABLE IF NOT EXISTS public.designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    preview_image_url TEXT,
    design_json JSONB NOT NULL DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'published', 'rejected')),
    is_public BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    saves_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Design Elements Table
CREATE TABLE IF NOT EXISTS public.design_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
    element_type TEXT NOT NULL,
    element_data JSONB NOT NULL DEFAULT '{}',
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Fabrics / Materials Table
CREATE TABLE IF NOT EXISTS public.fabrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    texture_url TEXT,
    color TEXT,
    weight TEXT,
    stretch TEXT,
    transparency TEXT,
    finish TEXT,
    recommended_usage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Patterns Table
CREATE TABLE IF NOT EXISTS public.patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    preview_url TEXT,
    pattern_data JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Color Palettes Table
CREATE TABLE IF NOT EXISTS public.color_palettes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    colors TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Products / Marketplace Catalog
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    designer_id UUID REFERENCES public.designers(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    image_urls TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    material TEXT,
    style TEXT,
    occasion TEXT,
    stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'pre_order')),
    product_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('product', 'design', 'outfit', 'designer')),
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 16. Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('design', 'outfit', 'product')),
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- 17. Follows Table
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 18. Moderation Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('user', 'designer', 'outfit', 'product', 'design')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'rejected')),
    admin_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 19. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Search History Log Table
CREATE TABLE IF NOT EXISTS public.searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    search_type TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AI Recommendations Cache Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    occasion TEXT,
    style TEXT,
    recommendation_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, user can edit own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Wardrobe: User can only manage own wardrobe
CREATE POLICY "Users can manage own wardrobe items" ON public.wardrobe_items 
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = wardrobe_items.user_id));

-- Outfits: User manage own, public view public outfits
CREATE POLICY "Public outfits viewable by everyone" ON public.outfits FOR SELECT USING (is_public OR auth.uid() = (SELECT user_id FROM public.profiles WHERE id = outfits.user_id));
CREATE POLICY "Users can manage own outfits" ON public.outfits FOR ALL USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = outfits.user_id));

-- Designs: Public view published, designer edit own
CREATE POLICY "Published designs are viewable by everyone" ON public.designs FOR SELECT USING (is_public OR status = 'published');
CREATE POLICY "Designers manage own designs" ON public.designs FOR ALL USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = (SELECT user_id FROM public.designers WHERE id = designs.designer_id))
);

-- =====================================================================
-- STORAGE BUCKETS SETUP
-- =====================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('wardrobe', 'wardrobe', false),
('designs', 'designs', true),
('fabrics', 'fabrics', true),
('patterns', 'patterns', true),
('products', 'products', true),
('collections', 'collections', true),
('inspiration', 'inspiration', false)
ON CONFLICT (id) DO NOTHING;
