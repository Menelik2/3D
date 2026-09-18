-- META Pictures — Best Wishes on private client galleries
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS gallery_wishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID NOT NULL REFERENCES client_galleries(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_wishes_gallery
  ON gallery_wishes(gallery_id, created_at DESC);

ALTER TABLE gallery_wishes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff full access gallery_wishes" ON gallery_wishes;
CREATE POLICY "Staff full access gallery_wishes" ON gallery_wishes
  FOR ALL USING (is_staff());

DROP POLICY IF EXISTS "Public read wishes of published galleries" ON gallery_wishes;
CREATE POLICY "Public read wishes of published galleries" ON gallery_wishes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_galleries g
      WHERE g.id = gallery_wishes.gallery_id AND g.is_published = true
    )
  );

-- Public inserts go through the Next.js API with the service role key.
