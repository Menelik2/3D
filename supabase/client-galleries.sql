-- META Pictures — Client photo galleries
-- Run in Supabase SQL Editor after the main schema.

CREATE TABLE IF NOT EXISTS client_galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID NOT NULL REFERENCES client_galleries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery ON gallery_images(gallery_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_client_galleries_token ON client_galleries(token);

DROP TRIGGER IF EXISTS client_galleries_updated_at ON client_galleries;
CREATE TRIGGER client_galleries_updated_at
  BEFORE UPDATE ON client_galleries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE client_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Staff full access
DROP POLICY IF EXISTS "Staff full access client_galleries" ON client_galleries;
CREATE POLICY "Staff full access client_galleries" ON client_galleries
  FOR ALL USING (is_staff());

DROP POLICY IF EXISTS "Staff full access gallery_images" ON gallery_images;
CREATE POLICY "Staff full access gallery_images" ON gallery_images
  FOR ALL USING (is_staff());

-- Public: read published galleries (token is the secret; we still require is_published)
DROP POLICY IF EXISTS "Public read published galleries" ON client_galleries;
CREATE POLICY "Public read published galleries" ON client_galleries
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public read images of published galleries" ON gallery_images;
CREATE POLICY "Public read images of published galleries" ON gallery_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_galleries g
      WHERE g.id = gallery_images.gallery_id AND g.is_published = true
    )
  );

-- Optional: create a public storage bucket named `galleries` in Dashboard → Storage
-- for client delivery photos (public read).
