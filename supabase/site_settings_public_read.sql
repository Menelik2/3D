-- Optional: allow public read of site_settings (contact/social/media on the public site).
-- Staff write access already exists via "Staff full access settings".
-- Run in Supabase SQL Editor if public pages do not pick up CMS values when service role is unset.

CREATE POLICY "Public can read site settings"
  ON site_settings
  FOR SELECT
  USING (true);
