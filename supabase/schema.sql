-- META Pictures — Production Database Schema
-- Run this in the Supabase SQL Editor (or via supabase db push)
-- Project: https://oqipymvqqptjxiaeasgd.supabase.co

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'ADMIN',
  'PRODUCER',
  'EDITOR',
  'CLIENT'
);

CREATE TYPE lead_status AS ENUM (
  'NEW',
  'CONTACTED',
  'CONSULTATION_SCHEDULED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'CONFIRMED',
  'IN_PRODUCTION',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED'
);

CREATE TYPE project_status AS ENUM (
  'IDEA',
  'PRE_PRODUCTION',
  'PRODUCTION',
  'EDITING',
  'COLOR_GRADING',
  'CLIENT_REVIEW',
  'FINAL_DELIVERY',
  'COMPLETED',
  'ON_HOLD',
  'CANCELLED'
);

CREATE TYPE consultation_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
);

CREATE TYPE media_visibility AS ENUM (
  'PUBLIC',
  'PRIVATE',
  'CLIENT_ONLY'
);

-- =============================================================================
-- CORE TABLES
-- =============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'CLIENT',
  avatar_url TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  what_is_included TEXT[],
  typical_workflow TEXT[],
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  skills TEXT[],
  profile_image_url TEXT,
  social_links JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  artist_name TEXT,
  director TEXT,
  cinematographer TEXT,
  production_date DATE,
  location TEXT,
  year INT,
  cover_image_url TEXT,
  video_url TEXT,
  video_poster_url TEXT,
  credits JSONB DEFAULT '[]',
  gallery JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT UNIQUE NOT NULL,
  status lead_status NOT NULL DEFAULT 'NEW',
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  preferred_contact TEXT,
  project_types TEXT[] DEFAULT '{}',
  project_title TEXT,
  project_description TEXT,
  creative_idea TEXT,
  references_text TEXT,
  visual_style TEXT,
  preferred_date DATE,
  alternative_date DATE,
  city TEXT,
  location TEXT,
  indoor_outdoor TEXT,
  expected_duration TEXT,
  budget_range TEXT,
  estimated_budget NUMERIC(12,2),
  final_budget NUMERIC(12,2),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  notes TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE SET NULL,
  status project_status NOT NULL DEFAULT 'IDEA',
  category TEXT,
  description TEXT,
  budget NUMERIC(12,2),
  location TEXT,
  production_date DATE,
  delivery_date DATE,
  cover_image_url TEXT,
  assigned_producer UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, profile_id)
);

CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_type TEXT NOT NULL,
  status consultation_status NOT NULL DEFAULT 'PENDING',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date DATE,
  preferred_time TIME,
  duration_minutes INT DEFAULT 30,
  notes TEXT,
  meeting_location TEXT,
  online_meeting_url TEXT,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  company TEXT,
  profile_image_url TEXT,
  quote TEXT NOT NULL,
  project_title TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  video_url TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  cover_image_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  social_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bts_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  media_urls JSONB DEFAULT '[]',
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  bucket TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  visibility media_visibility NOT NULL DEFAULT 'PRIVATE',
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'client-files',
  mime_type TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  is_deliverable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deliverable_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  version INT DEFAULT 1,
  status TEXT DEFAULT 'PENDING',
  client_feedback TEXT,
  timestamped_notes JSONB DEFAULT '[]',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE budget_ranges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  min_amount NUMERIC(12,2),
  max_amount NUMERIC(12,2),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_reference ON leads(reference_number);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_portfolio_slug ON portfolio_items(slug);
CREATE INDEX idx_portfolio_published ON portfolio_items(is_published);
CREATE INDEX idx_journal_slug ON journal_posts(slug);
CREATE INDEX idx_consultations_date ON consultations(preferred_date);
CREATE INDEX idx_media_project ON media(project_id);
CREATE INDEX idx_media_lead ON media(lead_id);

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER portfolio_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER journal_updated_at BEFORE UPDATE ON journal_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- REFERENCE NUMBER GENERATOR FOR LEADS
CREATE OR REPLACE FUNCTION generate_lead_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := 'MP-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_reference BEFORE INSERT ON leads
FOR EACH ROW EXECUTE FUNCTION generate_lead_reference();

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bts_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_ranges ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ADMIN', 'PRODUCER', 'EDITOR')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Public can read published portfolio" ON portfolio_items FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published journal" ON journal_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published services" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published testimonials" ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published faqs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published team" ON team_members FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published bts" ON bts_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active budget ranges" ON budget_ranges FOR SELECT USING (is_active = true);

CREATE POLICY "Staff full access profiles" ON profiles FOR ALL USING (is_staff());
CREATE POLICY "Staff full access leads" ON leads FOR ALL USING (is_staff());
CREATE POLICY "Staff full access clients" ON clients FOR ALL USING (is_staff());
CREATE POLICY "Staff full access projects" ON projects FOR ALL USING (is_staff());
CREATE POLICY "Staff full access portfolio" ON portfolio_items FOR ALL USING (is_staff());
CREATE POLICY "Staff full access journal" ON journal_posts FOR ALL USING (is_staff());
CREATE POLICY "Staff full access services" ON services FOR ALL USING (is_staff());
CREATE POLICY "Staff full access testimonials" ON testimonials FOR ALL USING (is_staff());
CREATE POLICY "Staff full access faqs" ON faqs FOR ALL USING (is_staff());
CREATE POLICY "Staff full access consultations" ON consultations FOR ALL USING (is_staff());
CREATE POLICY "Staff full access media" ON media FOR ALL USING (is_staff());
CREATE POLICY "Staff full access documents" ON documents FOR ALL USING (is_staff());
CREATE POLICY "Staff full access messages" ON messages FOR ALL USING (is_staff());
CREATE POLICY "Staff full access team" ON team_members FOR ALL USING (is_staff());
CREATE POLICY "Staff full access bts" ON bts_posts FOR ALL USING (is_staff());
CREATE POLICY "Staff full access settings" ON site_settings FOR ALL USING (is_staff());
CREATE POLICY "Staff full access budget_ranges" ON budget_ranges FOR ALL USING (is_staff());

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Clients can read own projects" ON projects FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can read own documents" ON documents FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can create a lead" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create a consultation" ON consultations FOR INSERT WITH CHECK (true);

-- SEED
INSERT INTO budget_ranges (label, min_amount, max_amount, sort_order) VALUES
  ('Under 10,000 ETB', 0, 10000, 1),
  ('10,000–25,000 ETB', 10000, 25000, 2),
  ('25,000–50,000 ETB', 25000, 50000, 3),
  ('50,000–100,000 ETB', 50000, 100000, 4),
  ('100,000+ ETB', 100000, NULL, 5),
  ('Not sure / Need a quote', NULL, NULL, 6);

INSERT INTO site_settings (key, value) VALUES
  ('contact', '{"phone":"","whatsapp":"","email":"hello@metapictures.example","address":""}'::jsonb),
  ('social', '{"instagram":"","youtube":"","tiktok":"","facebook":"","telegram":""}'::jsonb),
  ('brand', '{"primary_slogan":"EVERY FRAME HAS A STORY.","tagline":"We Don''t Just Film. We Create Cinema."}'::jsonb);

-- STORAGE BUCKETS (create in Dashboard → Storage):
-- portfolio (public), client-files (private), avatars (public), bts (public)
