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

DROP POLICY IF EXISTS "Staff full access client_galleries" ON client_galleries;
CREATE POLICY "Staff full access client_galleries" ON client_galleries
  FOR ALL USING (is_staff());

DROP POLICY IF EXISTS "Staff full access gallery_images" ON gallery_images;
CREATE POLICY "Staff full access gallery_images" ON gallery_images
  FOR ALL USING (is_staff());

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

-- ---------------------------------------------------------------------------
-- Storage bucket: galleries (create in Dashboard if missing)
-- Dashboard → Storage → New bucket → name: galleries → Public: ON
-- Then run the policies below (Storage policies).
-- ---------------------------------------------------------------------------

-- Allow authenticated staff to upload/update/delete in galleries bucket
-- (run in SQL; adjust if your storage schema differs)

INSERT INTO storage.buckets (id, name, public)
VALUES ('galleries', 'galleries', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read galleries bucket" ON storage.objects;
CREATE POLICY "Public read galleries bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galleries');

DROP POLICY IF EXISTS "Staff upload galleries bucket" ON storage.objects;
CREATE POLICY "Staff upload galleries bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'galleries'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Staff update galleries bucket" ON storage.objects;
CREATE POLICY "Staff update galleries bucket"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'galleries'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Staff delete galleries bucket" ON storage.objects;
CREATE POLICY "Staff delete galleries bucket"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'galleries'
    AND auth.role() = 'authenticated'
  );
